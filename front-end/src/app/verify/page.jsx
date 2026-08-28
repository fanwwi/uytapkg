"use client";

import { useState } from "react";
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
} from "lucide-react";

import styles from "./Verify.module.css";

export default function VerifyPage() {
  const [documents, setDocuments] = useState({
    document1: null,
    document2: null,
    document3: null,
  });

  const [showModal, setShowModal] = useState(false);

  const [status] = useState("pending");
  // Возможные статусы:
  // pending   — заявка рассматривается
  // approved  — профиль подтверждён
  // rejected  — отказ

  const [rejectionReason] = useState("");

  const handleFileChange = (key, event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Можно загрузить только PDF-файл.");
      return;
    }

    setDocuments((prev) => ({
      ...prev,
      [key]: file,
    }));
  };

  const removeFile = (key) => {
    setDocuments((prev) => ({
      ...prev,
      [key]: null,
    }));
  };

  const allDocumentsUploaded =
    documents.document1 && documents.document2 && documents.document3;

  const handleSubmit = () => {
    if (!allDocumentsUploaded) return;

    // Здесь позже подключается API отправки документов.
    console.log("Verification documents:", documents);

    setShowModal(true);
  };

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

          <a href="/verify" className={styles.primaryButton}>
            Подать заявку повторно
            <ArrowUpRight />
          </a>
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
                Для проверки необходимо предоставить 3 документа в формате PDF.
              </p>
            </div>

            <div className={styles.pdfBadge}>PDF</div>
          </div>

          <div className={styles.documents}>
            <DocumentUpload
              number="01"
              title="Документ о регистрации компании"
              description="Подтверждает официальную регистрацию организации."
              file={documents.document1}
              onChange={(event) => handleFileChange("document1", event)}
              onRemove={() => removeFile("document1")}
            />

            <DocumentUpload
              number="02"
              title="Документ, подтверждающий деятельность"
              description="Документ, подтверждающий деятельность компании в сфере недвижимости."
              file={documents.document2}
              onChange={(event) => handleFileChange("document2", event)}
              onRemove={() => removeFile("document2")}
            />

            <DocumentUpload
              number="03"
              title="Документ представителя компании"
              description="Документ, подтверждающий полномочия представителя компании(ID-card/passport)"
              file={documents.document3}
              onChange={(event) => handleFileChange("document3", event)}
              onRemove={() => removeFile("document3")}
            />
          </div>
        </section>

        {/* REQUIREMENTS */}

        <section className={styles.requirements}>
          <div className={styles.requirementIcon}>
            <FileText />
          </div>

          <div>
            <strong>Требования к документам</strong>

            <ul>
              <li>Только формат PDF</li>
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
  onChange,
  onRemove,
}) {
  return (
    <div className={`${styles.documentCard} ${file ? styles.uploaded : ""}`}>
      <div className={styles.documentTop}>
        <div className={styles.documentNumber}>{number}</div>

        {file && <CheckCircle className={styles.uploadedIcon} />}
      </div>

      <div className={styles.documentInfo}>
        <h3>{title}</h3>

        <p>{description}</p>
      </div>

      {file ? (
        <div className={styles.filePreview}>
          <div className={styles.fileIcon}>
            <FileText />
          </div>

          <div className={styles.fileName}>
            <strong>{file.name}</strong>
            <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>

          <button
            type="button"
            className={styles.removeFile}
            onClick={onRemove}
          >
            <X />
          </button>
        </div>
      ) : (
        <label className={styles.uploadButton}>
          <Upload />
          Загрузить PDF
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={onChange}
            hidden
          />
        </label>
      )}
    </div>
  );
}
