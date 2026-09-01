"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Check,
  FileText,
  X,
  ExternalLink,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { getAdminDevelopers, verifyDeveloperAdmin } from "@/utils/api";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import styles from "./Developers.module.css";

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadDevelopers();
  }, []);

  async function loadDevelopers() {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("uytap_token");
    if (!token) {
      setError("Требуется авторизация администратора");
      setLoading(false);
      return;
    }
    try {
      const data = await getAdminDevelopers(token);
      setDevelopers(data || []);
    } catch (err) {
      console.error("Error loading admin developers:", err);
      setError(err.message || "Ошибка загрузки застройщиков");
    } finally {
      setLoading(false);
    }
  }

  function openDeveloper(developer) {
    setSelectedDeveloper(developer);
    setRejectMode(false);
    setRejectReason("");
  }

  function closeModal() {
    setSelectedDeveloper(null);
    setRejectMode(false);
    setRejectReason("");
  }

  async function approveDeveloper() {
    if (!selectedDeveloper) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("uytap_token");
      await verifyDeveloperAdmin(token, selectedDeveloper.id, true);
      await loadDevelopers();
      closeModal();
    } catch (err) {
      alert(err.message || "Ошибка верификации");
    } finally {
      setActionLoading(false);
    }
  }

  function openRejectMode() {
    setRejectMode(true);
  }

  async function rejectDeveloper() {
    if (!selectedDeveloper || !rejectReason.trim()) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("uytap_token");
      await verifyDeveloperAdmin(token, selectedDeveloper.id, false, rejectReason);
      await loadDevelopers();
      closeModal();
    } catch (err) {
      alert(err.message || "Ошибка отклонения заявки");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <Sidebar />

      <div className={styles.content}>
        <Header
          title="Застройщики"
          subtitle="Верификация заявок и документов"
        />

        <main className={styles.main}>
          {/* HEADER */}

          <div className={styles.pageHeader}>
            <div>
              <h2>Заявки на верификацию</h2>

              <p>
                Проверьте данные застройщика и документы перед подтверждением
              </p>
            </div>

            <div className={styles.counter}>
              <span>{developers.length}</span>
              заявок
            </div>
          </div>

          {/* LIST */}

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
              <Loader2 className={styles.spinIcon} size={32} style={{ color: "#6d28d9" }} />
            </div>
          ) : error ? (
            <div style={{ padding: "20px", color: "#e53e3e", background: "#fed7d7", borderRadius: "10px" }}>
              {error}
            </div>
          ) : developers.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#718096" }}>
              Заявок на верификацию застройщиков пока нет.
            </div>
          ) : (
            <div className={styles.list}>
              {developers.map((developer) => {
                const docCount = developer.documents ? Object.keys(developer.documents).length : 0;
                const isApproved = developer.isVerified || developer.verificationStatus === "approved";
                const isRejected = developer.verificationStatus === "rejected";

                return (
                  <article key={developer.id} className={styles.developerCard}>
                    <div className={styles.developerImage}>
                      <img src={developer.image} alt={developer.name} />
                    </div>

                    <div className={styles.developerInfo}>
                      <div className={`${styles.status} ${isApproved ? styles.approved : isRejected ? styles.rejected : ""}`}>
                        {isApproved ? "Подтверждён" : isRejected ? "Отклонён" : "На проверке"}
                      </div>

                      <h3>{developer.name}</h3>

                      <p>
                        Представитель: <strong>{developer.representative}</strong>
                      </p>

                      <div className={styles.documentsCount}>
                        <FileText />
                        <span>{docCount} {docCount === 1 ? "документ" : docCount >= 2 && docCount <= 4 ? "документа" : "документов"}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={styles.reviewButton}
                      onClick={() => openDeveloper(developer)}
                    >
                      Рассмотреть
                      <ExternalLink />
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* MODAL */}

      {selectedDeveloper && (
        <div
          className={styles.overlay}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className={styles.modal}>
            {/* MODAL HEADER */}

            <div className={styles.modalHeader}>
              <div>
                <span>Заявка на верификацию</span>

                <h2>{selectedDeveloper.name}</h2>
              </div>

              <button
                type="button"
                className={styles.closeButton}
                onClick={closeModal}
              >
                <X />
              </button>
            </div>

            {/* COMPANY */}

            <div className={styles.companyInfo}>
              <div className={styles.modalImage}>
                <img
                  src={selectedDeveloper.image}
                  alt={selectedDeveloper.name}
                />
              </div>

              <div>
                <span>Представитель</span>
                <strong>{selectedDeveloper.representative}</strong>
              </div>

              <div>
                <span>Статус</span>
                <strong className={styles.pending}>На проверке</strong>
              </div>
            </div>

            {/* DOCUMENTS */}

            <div className={styles.documents}>
              <div className={styles.sectionTitle}>
                <div>
                  <h3>Документы</h3>
                  <p>Откройте каждый документ для проверки</p>
                </div>

                <FileText />
              </div>

              <div className={styles.documentList}>
                {selectedDeveloper.documents?.document1 ? (
                  <DocumentItem
                    number="01"
                    title="Документ о государственной регистрации"
                    file={selectedDeveloper.documents.document1}
                  />
                ) : selectedDeveloper.documents?.registration ? (
                  <DocumentItem
                    number="01"
                    title={selectedDeveloper.documents.registration.title || "Документ о регистрации"}
                    file={selectedDeveloper.documents.registration.file}
                  />
                ) : null}

                {selectedDeveloper.documents?.document2 ? (
                  <DocumentItem
                    number="02"
                    title="Лицензия на строительную деятельность"
                    file={selectedDeveloper.documents.document2}
                  />
                ) : selectedDeveloper.documents?.construction ? (
                  <DocumentItem
                    number="02"
                    title={selectedDeveloper.documents.construction.title || "Документ на строительство"}
                    file={selectedDeveloper.documents.construction.file}
                  />
                ) : null}

                {selectedDeveloper.documents?.document3 ? (
                  <DocumentItem
                    number="03"
                    title="Паспорт / ID представителя"
                    file={selectedDeveloper.documents.document3}
                  />
                ) : selectedDeveloper.documents?.representativeId ? (
                  <DocumentItem
                    number="03"
                    title={selectedDeveloper.documents.representativeId.title || "ID Card представителя"}
                    file={selectedDeveloper.documents.representativeId.file}
                  />
                ) : null}

                {!selectedDeveloper.documents && (
                  <div style={{ padding: "15px", color: "#718096", fontSize: "14px" }}>
                    Документы не загружены
                  </div>
                )}
              </div>
            </div>

            {/* REJECTION */}

            {rejectMode && (
              <div className={styles.rejectBox}>
                <div className={styles.rejectTitle}>
                  <AlertCircle />

                  <div>
                    <strong>Причина отказа</strong>

                    <span>Укажите причину, которую получит застройщик</span>
                  </div>
                </div>

                <textarea
                  value={rejectReason}
                  onChange={(event) => setRejectReason(event.target.value)}
                  placeholder="Например: документ на строительную деятельность просрочен..."
                />

                <div className={styles.rejectActions}>
                  <button
                    type="button"
                    className={styles.cancelReject}
                    onClick={() => {
                      setRejectMode(false);
                      setRejectReason("");
                    }}
                  >
                    Отмена
                  </button>

                  <button
                    type="button"
                    className={styles.confirmReject}
                    disabled={!rejectReason.trim() || actionLoading}
                    onClick={rejectDeveloper}
                  >
                    {actionLoading ? "Сохранение..." : "Подтвердить отказ"}
                  </button>
                </div>
              </div>
            )}

            {/* ACTIONS */}

            {!rejectMode && (
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.rejectButton}
                  onClick={openRejectMode}
                  disabled={actionLoading}
                >
                  <X />
                  Отказать
                </button>

                <button
                  type="button"
                  className={styles.approveButton}
                  onClick={approveDeveloper}
                  disabled={actionLoading}
                >
                  <Check />
                  {actionLoading ? "Сохранение..." : "Одобрить верификацию"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   DOCUMENT ITEM
========================================================= */

function DocumentItem({ number, title, file, document }) {
  const docTitle = title || document?.title || "Документ";
  const docFile = file || document?.file || "#";

  return (
    <div className={styles.document}>
      <div className={styles.documentNumber}>{number}</div>

      <div className={styles.documentIcon}>
        <FileText />
      </div>

      <div className={styles.documentInfo}>
        <strong>{docTitle}</strong>
        <span>Файл документа</span>
      </div>

      <a
        href={docFile}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.openDocument}
      >
        Открыть
        <ExternalLink />
      </a>
    </div>
  );
}
