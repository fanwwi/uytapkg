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

import { useLanguage } from "@/context/LanguageContext";

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
  const { t } = useLanguage();

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
  const [status, setStatus] = useState("none");
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingKey, setUploadingKey] = useState(null);
  const [errorKey, setErrorKey] = useState("");
  const [dynamicError, setDynamicError] = useState("");

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
      setDynamicError("");
      setErrorKey("verify.errors.fileType");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setDynamicError("");
      setErrorKey("verify.errors.fileSize");
      return;
    }

    const token = localStorage.getItem("uytap_token");

    if (!token) {
      setDynamicError("");
      setErrorKey("verify.errors.authorization");
      return;
    }

    setUploadingKey(key);
    setErrorKey("");
    setDynamicError("");

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

      setErrorKey("");
      setDynamicError(err.message || t("verify.errors.upload"));
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
    setErrorKey("");
    setDynamicError("");

    try {
      const token = localStorage.getItem("uytap_token");

      if (!token) {
        setErrorKey("verify.errors.authorizationShort");
        return;
      }

      const res = await submitVerificationRequest(token, documentUrls);

      if (res.success) {
        setStatus("pending");
        setShowModal(true);
      } else {
        setErrorKey("");
        setDynamicError(res.message || t("verify.errors.submit"));
      }
    } catch (err) {
      console.error("Submit error:", err);

      setErrorKey("");
      setDynamicError(err.message || t("verify.errors.network"));
    } finally {
      setSubmitting(false);
    }
  };

  const errorText = errorKey ? t(errorKey) : dynamicError;

  if (loading) {
    return (
      <main className={styles.page}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <Loader2
            size={32}
            className={styles.spinIcon}
            style={{ color: "#483df6" }}
          />
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

          <h1>{t("verify.approved.title")}</h1>

          <p>{t("verify.approved.description")}</p>

          <a href="/profile" className={styles.primaryButton}>
            {t("verify.approved.profile")}
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

          <h1>{t("verify.rejected.title")}</h1>

          <p>{t("verify.rejected.description")}</p>

          {rejectionReason && (
            <div className={styles.reason}>
              <strong>{t("verify.rejected.reason")}</strong>
              <p>{rejectionReason}</p>
            </div>
          )}

          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => {
              setStatus("none");
              setErrorKey("");
              setDynamicError("");
            }}
          >
            {t("verify.rejected.resubmit")}
            <ArrowUpRight />
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <a href="/profile" className={styles.back}>
          <ArrowLeft />
          {t("verify.back")}
        </a>

        <section className={styles.hero}>
          <div className={styles.heroIcon}>
            <ShieldCheck />
          </div>

          <div>
            <div className={styles.eyebrow}>{t("verify.hero.eyebrow")}</div>

            <h1>{t("verify.hero.title")}</h1>

            <p>{t("verify.hero.description")}</p>
          </div>
        </section>

        <section className={styles.infoCard}>
          <div className={styles.infoIcon}>
            <ShieldCheck />
          </div>

          <div>
            <h2>{t("verify.why.title")}</h2>

            <p>{t("verify.why.description")}</p>
          </div>
        </section>

        <section className={styles.documentsSection}>
          <div className={styles.sectionHeading}>
            <div>
              <span>{t("verify.documents.step")}</span>

              <h2>{t("verify.documents.title")}</h2>

              <p>{t("verify.documents.description")}</p>
            </div>

            <div className={styles.pdfBadge}>{t("verify.documents.types")}</div>
          </div>

          <div className={styles.documents}>
            <DocumentUpload
              number="01"
              title={t("verify.documents.items.registration.title")}
              description={t("verify.documents.items.registration.description")}
              file={documents.document1}
              uploaded={Boolean(documentUrls.document1)}
              uploading={uploadingKey === "document1"}
              onChange={(event) => handleFileChange("document1", event)}
              onRemove={() => removeFile("document1")}
            />

            <DocumentUpload
              number="02"
              title={t("verify.documents.items.activity.title")}
              description={t("verify.documents.items.activity.description")}
              file={documents.document2}
              uploaded={Boolean(documentUrls.document2)}
              uploading={uploadingKey === "document2"}
              onChange={(event) => handleFileChange("document2", event)}
              onRemove={() => removeFile("document2")}
            />

            <DocumentUpload
              number="03"
              title={t("verify.documents.items.representative.title")}
              description={t(
                "verify.documents.items.representative.description",
              )}
              file={documents.document3}
              uploaded={Boolean(documentUrls.document3)}
              uploading={uploadingKey === "document3"}
              onChange={(event) => handleFileChange("document3", event)}
              onRemove={() => removeFile("document3")}
            />
          </div>

          {errorText && (
            <p
              style={{
                color: "#e05252",
                fontSize: 13,
                marginTop: 14,
              }}
            >
              {errorText}
            </p>
          )}
        </section>

        <section className={styles.requirements}>
          <div className={styles.requirementIcon}>
            <FileText />
          </div>

          <div>
            <strong>{t("verify.requirements.title")}</strong>

            <ul>
              {t("verify.requirements.items").map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.submitSection}>
          <div className={styles.submitText}>
            <Clock3 />

            <div>
              <strong>{t("verify.submit.title")}</strong>

              <p>{t("verify.submit.description")}</p>
            </div>
          </div>

          <button
            type="button"
            className={styles.submitButton}
            disabled={!allDocumentsUploaded || submitting}
            onClick={handleSubmit}
          >
            {submitting
              ? t("verify.documents.uploading")
              : t("verify.submit.button")}

            <ArrowUpRight />
          </button>
        </section>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setShowModal(false)}
              aria-label={t("verify.modal.close")}
            >
              <X />
            </button>

            <div className={styles.modalIcon}>
              <Clock3 />
            </div>

            <div className={styles.modalBadge}>{t("verify.modal.badge")}</div>

            <h2>{t("verify.modal.title")}</h2>

            <p>{t("verify.modal.description")}</p>

            <p>{t("verify.modal.descriptionSecond")}</p>

            <div className={styles.modalNote}>
              <ShieldCheck />

              <span>{t("verify.modal.note")}</span>
            </div>

            <a href="/profile" className={styles.modalButton}>
              {t("verify.modal.profile")}
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
  const { t } = useLanguage();

  return (
    <div
      className={`${styles.documentCard} ${uploaded ? styles.uploaded : ""}`}
    >
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
            <strong>{file ? file.name : t("verify.documents.uploaded")}</strong>

            {file && <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>}
          </div>

          <button
            type="button"
            className={styles.removeFile}
            onClick={onRemove}
            disabled={uploading}
            aria-label={t("common.cancel")}
          >
            <X />
          </button>
        </div>
      ) : (
        <label className={styles.uploadButton} aria-disabled={uploading}>
          {uploading ? <Loader2 className={styles.spinIcon} /> : <Upload />}

          {uploading
            ? t("verify.documents.uploading")
            : t("verify.documents.upload")}

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
