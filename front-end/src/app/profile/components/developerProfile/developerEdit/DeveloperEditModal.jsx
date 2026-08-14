"use client";

import { useRef, useState } from "react";

import {
  X,
  Camera,
  Building2,
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  FileText,
  Hash,
  User,
  Check,
  Trash2,
  Landmark,
} from "lucide-react";

import styles from "./DeveloperEditModal.module.css";

import { getMe, updateMe } from "@/utils/api";

export default function DeveloperEditModal({ user, close }) {
  const fileRef = useRef(null);

  const profile = user?.profile || {};

  const DEFAULT_LOGO = "/assets/DeveloperImage.png";

  const initialLogo =
    profile.avatar_url ||
    profile.logo_url ||
    profile.avatar ||
    user?.avatar_url ||
    user?.avatar ||
    DEFAULT_LOGO;

  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState(profile.first_name || "");
  const [lastName, setLastName] = useState(profile.last_name || "");

  const [companyName, setCompanyName] = useState(
    profile.company_name || profile.company || "",
  );

  const [inn, setInn] = useState(profile.inn || "");

  const [phone, setPhone] = useState(user?.phone || "");

  const [whatsapp, setWhatsapp] = useState(
    profile.whatsapp || user?.phone || "",
  );

  const [website, setWebsite] = useState(profile.website || "");

  const [officeAddress, setOfficeAddress] = useState(
    profile.office_address || "",
  );

  const [about, setAbout] = useState(profile.about || "");

  const [logo, setLogo] = useState(initialLogo);
  const [logoFile, setLogoFile] = useState(null);
  const [logoRemoved, setLogoRemoved] = useState(false);

  /*
   * =========================================================
   * IMAGE
   * =========================================================
   */

  function handleLogoChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Можно загрузить только изображение");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Размер изображения не должен превышать 5 МБ");
      return;
    }

    setLogoFile(file);
    setLogo(URL.createObjectURL(file));
    setLogoRemoved(false);
  }

  function removeLogo() {
    setLogo(DEFAULT_LOGO);
    setLogoFile(null);
    setLogoRemoved(true);
  }

  /*
   * =========================================================
   * TOKEN
   * =========================================================
   */

  function getToken() {
    const cookie = document.cookie.match(/(^|;)\s*uytap_token=([^;]*)/);

    return (
      (cookie ? decodeURIComponent(cookie[2]) : null) ||
      localStorage.getItem("uytap_token")
    );
  }

  /*
   * =========================================================
   * SAVE
   * =========================================================
   */

  async function save() {
    if (loading) return;

    const token = getToken();

    if (!token) {
      alert("Сессия закончилась. Войдите в аккаунт заново.");
      return;
    }

    if (!companyName.trim()) {
      alert("Введите название компании");
      return;
    }

    try {
      setLoading(true);

      /*
       * -------------------------------------------------------
       * 1. Сначала обновляем обычные данные профиля
       * -------------------------------------------------------
       */

      await updateMe(token, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        companyName: companyName.trim(),
        inn: inn.trim(),
        whatsapp: whatsapp.trim(),
        website: website.trim(),
        officeAddress: officeAddress.trim(),
        about: about.trim(),
      });

      /*
       * -------------------------------------------------------
       * 2. Если пользователь выбрал новый логотип
       * -------------------------------------------------------
       *
       * Используем существующий endpoint avatar.
       */

      if (logoFile) {
        const formData = new FormData();

        formData.append("avatar", logoFile);

        const response = await fetch("/api/auth/avatar", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Не удалось загрузить логотип");
        }
      }

      /*
       * -------------------------------------------------------
       * 3. Получаем полностью свежий профиль
       * -------------------------------------------------------
       */

      const freshUser = await getMe(token);

      /*
       * Если удалили логотип — оставляем дефолтную картинку
       * на фронте.
       *
       * Если backend умеет удалять avatar, сюда можно добавить
       * отдельный DELETE endpoint.
       */

      const freshProfile = {
        ...(freshUser.profile || {}),
      };

      if (logoRemoved) {
        freshProfile.avatar_url = freshProfile.avatar_url || DEFAULT_LOGO;

        freshProfile.avatar = freshProfile.avatar || DEFAULT_LOGO;
      }

      /*
       * -------------------------------------------------------
       * 4. Сохраняем в localStorage
       * -------------------------------------------------------
       */

      const updatedUser = {
        ...freshUser,

        phone: phone.trim(),

        profile: {
          ...freshProfile,

          first_name: firstName.trim(),
          last_name: lastName.trim(),

          company_name: companyName.trim(),

          inn: inn.trim(),

          whatsapp: whatsapp.trim(),

          website: website.trim(),

          office_address: officeAddress.trim(),

          about: about.trim(),
        },
      };

      localStorage.setItem("uytap_user", JSON.stringify(updatedUser));

      /*
       * -------------------------------------------------------
       * 5. Уведомляем приложение
       * -------------------------------------------------------
       */

      window.dispatchEvent(
        new CustomEvent("uytap:user-updated", {
          detail: updatedUser,
        }),
      );

      /*
       * -------------------------------------------------------
       * 6. Закрываем
       * -------------------------------------------------------
       */

      close();

      /*
       * Перезагружаем страницу, чтобы профиль гарантированно
       * подтянул все изменения.
       */

      window.location.reload();
    } catch (error) {
      console.error("DEVELOPER PROFILE SAVE ERROR:", error);

      alert(error?.message || "Не удалось сохранить изменения профиля");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* =====================================================
            CLOSE
        ===================================================== */}

        <button
          type="button"
          className={styles.close}
          onClick={close}
          disabled={loading}
        >
          <X />
        </button>

        <div className={styles.scroll}>
          {/* =====================================================
              HEADER
          ===================================================== */}

          <header className={styles.header}>
            <div className={styles.headerBadge}>
              <Landmark />
              Профиль застройщика
            </div>

            <h2>Редактирование компании</h2>

            <p>Обновите информацию о компании, представителе и контактах.</p>
          </header>

          {/* =====================================================
              LOGO
          ===================================================== */}

          <section className={styles.logoSection}>
            <div className={styles.logoWrapper}>
              <div className={styles.logo}>
                {logo ? (
                  <img src={logo} alt="Логотип компании" />
                ) : (
                  <Building2 />
                )}
              </div>

              <div className={styles.logoCamera}>
                <Camera />
              </div>
            </div>

            <div className={styles.logoInfo}>
              <strong>Логотип компании</strong>

              <span>PNG, JPG или WEBP · до 5 МБ</span>

              <div className={styles.logoActions}>
                <label className={styles.uploadButton}>
                  <Camera />

                  <span>{logoFile ? "Изменить" : "Загрузить логотип"}</span>

                  <input
                    ref={fileRef}
                    hidden
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleLogoChange}
                    disabled={loading}
                  />
                </label>

                {logo && !logoRemoved && (
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={removeLogo}
                    disabled={loading}
                  >
                    <Trash2 />
                    Удалить
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* =====================================================
              COMPANY
          ===================================================== */}

          <section className={styles.formSection}>
            <div className={styles.sectionTitle}>
              <Building2 />
              <div>
                <strong>Компания</strong>
                <span>Основная информация о застройщике</span>
              </div>
            </div>

            <div className={styles.fields}>
              <Field
                icon={<Building2 />}
                label="Название компании"
                value={companyName}
                onChange={setCompanyName}
                placeholder="Например, ОсОО СтройИнвест"
                disabled={loading}
              />

              <Field
                icon={<Hash />}
                label="ИНН"
                value={inn}
                onChange={setInn}
                placeholder="Введите ИНН компании"
                disabled={loading}
              />
            </div>
          </section>

          {/* =====================================================
              REPRESENTATIVE
          ===================================================== */}

          <section className={styles.formSection}>
            <div className={styles.sectionTitle}>
              <User />
              <div>
                <strong>Представитель</strong>
                <span>Контактное лицо компании</span>
              </div>
            </div>

            <div className={styles.fields}>
              <div className={styles.row}>
                <Field
                  icon={<User />}
                  label="Имя"
                  value={firstName}
                  onChange={setFirstName}
                  placeholder="Имя"
                  disabled={loading}
                />

                <Field
                  icon={<User />}
                  label="Фамилия"
                  value={lastName}
                  onChange={setLastName}
                  placeholder="Фамилия"
                  disabled={loading}
                />
              </div>
            </div>
          </section>

          {/* =====================================================
              CONTACTS
          ===================================================== */}

          <section className={styles.formSection}>
            <div className={styles.sectionTitle}>
              <Phone />
              <div>
                <strong>Контакты</strong>
                <span>Как покупатели смогут связаться с вами</span>
              </div>
            </div>

            <div className={styles.fields}>
              <Field
                icon={<Phone />}
                label="Телефон"
                value={phone}
                onChange={setPhone}
                placeholder="+996 555 123 456"
                type="tel"
                disabled={loading}
              />

              <Field
                icon={<MessageCircle />}
                label="WhatsApp"
                value={whatsapp}
                onChange={setWhatsapp}
                placeholder="+996 555 123 456"
                type="tel"
                disabled={loading}
              />

              <Field
                icon={<Globe />}
                label="Сайт"
                value={website}
                onChange={setWebsite}
                placeholder="https://company.kg"
                disabled={loading}
              />

              <Field
                icon={<MapPin />}
                label="Адрес офиса"
                value={officeAddress}
                onChange={setOfficeAddress}
                placeholder="Бишкек, ул. ..."
                disabled={loading}
              />
            </div>
          </section>

          {/* =====================================================
              ABOUT
          ===================================================== */}

          <section className={styles.formSection}>
            <div className={styles.sectionTitle}>
              <FileText />
              <div>
                <strong>О компании</strong>
                <span>Коротко расскажите о вашей компании</span>
              </div>
            </div>

            <div className={styles.textareaBox}>
              <FileText />

              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Расскажите о компании, опыте работы, проектах, специализации и преимуществах..."
                disabled={loading}
                maxLength={1000}
              />

              <span>{about.length}/1000</span>
            </div>
          </section>

          {/* =====================================================
              SAVE
          ===================================================== */}

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancel}
              onClick={close}
              disabled={loading}
            >
              Отмена
            </button>

            <button
              type="button"
              className={styles.save}
              onClick={save}
              disabled={loading}
            >
              <Check />

              {loading ? "Сохраняем..." : "Сохранить изменения"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * =========================================================
 * FIELD
 * =========================================================
 */

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
}) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>

      <div className={styles.inputBox}>
        {icon}

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
    </label>
  );
}
