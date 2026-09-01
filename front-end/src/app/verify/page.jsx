"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  FileText,
  Upload,
  CheckCircle,
  ArrowLeft,
  ArrowUpRight,
  X,
  Clock3,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  getVerificationStatus,
  submitVerificationRequest,
  uploadVerificationDocument,
} from "@/utils/api";
import styles from "./Verify.module.css";

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function VerifyPage() {
  const [documents, setDocuments] = useState({
    document1: null,
    document2: null,
    document3: null,
  });

  const [documentUrls, setDocumentUrls] = useState({
    document1: "",
    document2: "",
    document3: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("none"); // none | pending | approved | rejected
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingKey, setUploadingKey] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadStatus() {
      const token = localStorage.getItem("uytap_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await getVerificationStatus(token);
        if (res.success) {
          setStatus(res.status || (res.isVerified ? "approved" : "none"));
          setRejectionReason(res.rejectionReason || "");
          if (res.documents) {
            setDocumentUrls(res.documents);
          }
        }
      } catch (err) {
        console.error("Error loading verification status:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStatus();
  }, []);

  const handleFileChange = async (key, event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrorMsg("Допустимые форматы: PDF, JPEG, PNG или WebP.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg("Размер файла не должен превышать 10 МБ.");
      return;
    }

    const token = localStorage.getItem("uytap_token");
    if (!token) {
      setErrorMsg("Требуется авторизация. Войдите в аккаунт застройщика.");
      return;
    }

    setUploadingKey(key);
    setErrorMsg("");

    try {
      const uploadRes = await uploadVerificationDocument(token, file);

      setDocuments((prev) => ({
        ...prev,
        [key]: file,
      }));

      setDocumentUrls((prev) => ({
        ...prev,
        [key]: uploadRes.path,
      }));
    } catch (err) {
      console.error("Document upload error:", err);
      setErrorMsg(err.message || "Не удалось загрузить файл. Попробуйте еще раз.");
    } finally {
      setUploadingKey(null);
    }
  };

  const removeFile = (key) => {
    setDocuments((prev) => ({
      ...prev,
      [key]: null,
    }));
    setDocumentUrls((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const allDocumentsUploaded =
    Boolean(documentUrls.document1) &&
    Boolean(documentUrls.document2) &&
    Boolean(documentUrls.document3);

  const handleSubmit = async () => {
    if (!allDocumentsUploaded) return;

    setSubmitting(true);
    setErrorMsg("");

    try {
      const token = localStorage.getItem("uytap_token");
      if (!token) {
        setErrorMsg("Требуется авторизация");
        return;
      }

      const res = await submitVerificationRequest(token, documentUrls);
      if (res.success) {
        setStatus("pending");
        setShowModal(true);
      } else {
        setErrorMsg(res.message || "Ошибка отправки документов");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setErrorMsg(err.message || "Ошибка сети при отправке");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
          <Loader2 size={32} className={styles.spinIcon} style={{ color: "#483df6" }} />
        </div>
      </main>
    );
  }

  if (status === "approved") {
    return (
      <main className={styles.page}>
        <section className={styles.statusCard}>
          <div className={`${styles.statusIcon} ${styles.success}`}>
            <CheckCircle />
          </div>

          <h1>Профиль подтверждён</h1>

          <p>
            Ваша компания успешно прошла проверку. Теперь рядом с профилем
            отображается подтверждающая галочка, а ваши ЖК и объявления доступны
            другим пользователям.
          </p>

          <a href="/profile" className={styles.primaryButton}>
            Перейти в профиль
            <ArrowUpRight />
          </a>
        </section>
      </main>
    );
  }

  if (status === "rejected") {
    return (
      <main className={styles.page}>
        <section className={styles.statusCard}>
          <div className={`${styles.statusIcon} ${styles.error}`}>
            <AlertCircle />
          </div>

          <h1>Заявка отклонена</h1>

          <p>К сожалению, мы не смогли подтвердить ваш профиль.</p>

          {rejectionReason && (
            <div className={styles.reason}>
              <strong>Причина отказа</strong>
              <p>{rejectionReason}</p>
            </div>
          )}

          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => {
              setStatus("none");
              setErrorMsg("");
            }}
          >
            Подать заявку повторно
            <ArrowUpRight />
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* BACK */}

        <a href="/profile" className={styles.back}>
          <ArrowLeft />
          Вернуться в профиль
        </a>

        {/* HEADER */}

        <section className={styles.hero}>
          <div className={styles.heroIcon}>
            <ShieldCheck />
          </div>

          <div>
            <div className={styles.eyebrow}>Проверка профиля</div>

            <h1>Подтвердите профиль застройщика</h1>

            <p>
              Подтверждение помогает покупателям убедиться, что ваш профиль
              принадлежит реальной строительной компании. После успешной
              проверки рядом с названием компании появится галочка.
            </p>
          </div>
        </section>

        {/* WHY */}

        <section className={styles.infoCard}>
          <div className={styles.infoIcon}>
            <ShieldCheck />
          </div>

          <div>
            <h2>Зачем подтверждать профиль?</h2>

            <p>
              Подтверждённые компании вызывают больше доверия у покупателей.
              После получения галочки ваши жилые комплексы и объявления смогут
              отображаться другим пользователям платформы.
            </p>
          </div>
        </section>

        {/* DOCUMENTS */}

        <section className={styles.documentsSection}>
          <div className={styles.sectionHeading}>
            <div>
              <span>Шаг 1</span>
              <h2>Загрузите документы</h2>
              <p>
                Для проверки необходимо предоставить 3 документа в формате PDF, JPEG или PNG.
              </p>
            </div>

            <div className={styles.pdfBadge}>PDF / JPG / PNG</div>
          </div>

          <div className={styles.documents}>
            <DocumentUpload
              number="01"
              title="Документ о регистрации компании"
              description="Подтверждает официальную регистрацию организации."
              file={documents.document1}
              uploaded={Boolean(documentUrls.document1)}
              uploading={uploadingKey === "document1"}
              onChange={(event) => handleFileChange("document1", event)}
              onRemove={() => removeFile("document1")}
            />

            <DocumentUpload
              number="02"
              title="Документ, подтверждающий деятельность"
              description="Документ, подтверждающий деятельность компании в сфере недвижимости."
              file={documents.document2}
              uploaded={Boolean(documentUrls.document2)}
              uploading={uploadingKey === "document2"}
              onChange={(event) => handleFileChange("document2", event)}
              onRemove={() => removeFile("document2")}
            />

            <DocumentUpload
              number="03"
              title="Документ представителя компании"
              description="Документ, подтверждающий полномочия представителя компании(ID-card/passport)"
              file={documents.document3}
              uploaded={Boolean(documentUrls.document3)}
              uploading={uploadingKey === "document3"}
              onChange={(event) => handleFileChange("document3", event)}
              onRemove={() => removeFile("document3")}
            />
          </div>

          {errorMsg && (
            <p style={{ color: "#e05252", fontSize: 13, marginTop: 14 }}>{errorMsg}</p>
          )}
        </section>

        {/* REQUIREMENTS */}

        <section className={styles.requirements}>
          <div className={styles.requirementIcon}>
            <FileText />
          </div>

          <div>
            <strong>Требования к документам</strong>

            <ul>
              <li>PDF, JPEG, PNG или WebP, до 10 МБ</li>
              <li>Документы должны быть читаемыми</li>
              <li>Документы должны быть актуальными</li>
              <li>
                Информация в документах должна совпадать с данными профиля
              </li>
            </ul>
          </div>
        </section>

        {/* SUBMIT */}

        <section className={styles.submitSection}>
          <div className={styles.submitText}>
            <Clock3 />

            <div>
              <strong>Что произойдёт после отправки?</strong>

              <p>
                Заявку проверит команда UyTap. По результатам проверки вы
                получите подтверждающую галочку либо отказ с указанием причины.
              </p>
            </div>
          </div>

          <button
            type="button"
            className={styles.submitButton}
            disabled={!allDocumentsUploaded}
            onClick={handleSubmit}
          >
            Отправить на проверку
            <ArrowUpRight />
          </button>
        </section>
      </div>

      {/* PENDING MODAL */}

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setShowModal(false)}
              aria-label="Закрыть"
            >
              <X />
            </button>

            <div className={styles.modalIcon}>
              <Clock3 />
            </div>

            <div className={styles.modalBadge}>На рассмотрении</div>

            <h2>Заявка отправлена</h2>

            <p>
              Спасибо! Мы получили ваши документы и начали проверку профиля.
            </p>

            <p>
              После проверки вы получите подтверждающую галочку или отказ с
              указанием причины.
            </p>

            <div className={styles.modalNote}>
              <ShieldCheck />
              <span>
                Пока заявка рассматривается, профиль, ЖК и объявления не будут
                отображаться другим пользователям.
              </span>
            </div>

            <a href="/profile" className={styles.modalButton}>
              Вернуться в профиль
              <ArrowUpRight />
            </a>
          </div>
        </div>
      )}
    </main>
  );
}

function DocumentUpload({
  number,
  title,
  description,
  file,
  uploaded,
  uploading,
  onChange,
  onRemove,
}) {
  return (
    <div className={`${styles.documentCard} ${uploaded ? styles.uploaded : ""}`}>
      <div className={styles.documentTop}>
        <div className={styles.documentNumber}>{number}</div>

        {uploaded && <CheckCircle className={styles.uploadedIcon} />}
      </div>

      <div className={styles.documentInfo}>
        <h3>{title}</h3>

        <p>{description}</p>
      </div>

      {uploaded ? (
        <div className={styles.filePreview}>
          <div className={styles.fileIcon}>
            <FileText />
          </div>

          <div className={styles.fileName}>
            <strong>{file ? file.name : "Документ загружен"}</strong>
            {file && <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>}
          </div>

          <button
            type="button"
            className={styles.removeFile}
            onClick={onRemove}
            disabled={uploading}
          >
            <X />
          </button>
        </div>
      ) : (
        <label className={styles.uploadButton} aria-disabled={uploading}>
          {uploading ? <Loader2 className={styles.spinIcon} /> : <Upload />}
          {uploading ? "Загрузка..." : "Загрузить файл"}
          <input
            type="file"
            accept="application/pdf,.pdf,image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            onChange={onChange}
            disabled={uploading}
            hidden
          />
        </label>
      )}
    </div>
  );
}
