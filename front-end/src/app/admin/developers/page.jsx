"use client";

import { useState } from "react";
import {
  Building2,
  Check,
  FileText,
  X,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import styles from "./Developers.module.css";

const developers = [
  {
    id: 1,
    name: "ОсОО СтройДом",
    representative: "Айбек Абдрахманов",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&q=80",

    documents: {
      registration: {
        title: "Документ о регистрации",
        file: "/documents/registration.pdf",
      },

      construction: {
        title: "Документ на строительную деятельность",
        file: "/documents/construction.pdf",
      },

      representativeId: {
        title: "ID Card представителя",
        file: "/documents/representative-id.pdf",
      },
    },
  },

  {
    id: 2,
    name: "ОсОО Бишкек Девелопмент",
    representative: "Руслан Исмаилов",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80",

    documents: {
      registration: {
        title: "Документ о регистрации",
        file: "/documents/registration.pdf",
      },

      construction: {
        title: "Документ на строительную деятельность",
        file: "/documents/construction.pdf",
      },

      representativeId: {
        title: "ID Card представителя",
        file: "/documents/representative-id.pdf",
      },
    },
  },

  {
    id: 3,
    name: "ОсОО Nova Construction",
    representative: "Данияр Токтогулов",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=500&q=80",

    documents: {
      registration: {
        title: "Документ о регистрации",
        file: "/documents/registration.pdf",
      },

      construction: {
        title: "Документ на строительную деятельность",
        file: "/documents/construction.pdf",
      },

      representativeId: {
        title: "ID Card представителя",
        file: "/documents/representative-id.pdf",
      },
    },
  },
];

export default function DevelopersPage() {
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

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

  function approveDeveloper() {
    if (!selectedDeveloper) return;

    // TODO:
    // Здесь позже будет API:
    // POST /admin/developers/:id/approve

    console.log("Developer approved:", selectedDeveloper.id);

    closeModal();
  }

  function openRejectMode() {
    setRejectMode(true);
  }

  function rejectDeveloper() {
    if (!selectedDeveloper) return;

    if (!rejectReason.trim()) return;

    // TODO:
    // Здесь позже будет API:
    // POST /admin/developers/:id/reject
    // {
    //   reason: rejectReason
    // }

    console.log("Developer rejected:", {
      id: selectedDeveloper.id,
      reason: rejectReason,
    });

    closeModal();
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

          <div className={styles.list}>
            {developers.map((developer) => (
              <article key={developer.id} className={styles.developerCard}>
                <div className={styles.developerImage}>
                  <img src={developer.image} alt={developer.name} />
                </div>

                <div className={styles.developerInfo}>
                  <div className={styles.status}>На проверке</div>

                  <h3>{developer.name}</h3>

                  <p>
                    Представитель: <strong>{developer.representative}</strong>
                  </p>

                  <div className={styles.documentsCount}>
                    <FileText />
                    <span>3 документа</span>
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
            ))}
          </div>
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
                <DocumentItem
                  number="01"
                  document={selectedDeveloper.documents.registration}
                />

                <DocumentItem
                  number="02"
                  document={selectedDeveloper.documents.construction}
                />

                <DocumentItem
                  number="03"
                  document={selectedDeveloper.documents.representativeId}
                />
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
                    disabled={!rejectReason.trim()}
                    onClick={rejectDeveloper}
                  >
                    Подтвердить отказ
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
                >
                  <X />
                  Отказать
                </button>

                <button
                  type="button"
                  className={styles.approveButton}
                  onClick={approveDeveloper}
                >
                  <Check />
                  Одобрить верификацию
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

function DocumentItem({ number, document }) {
  return (
    <div className={styles.document}>
      <div className={styles.documentNumber}>{number}</div>

      <div className={styles.documentIcon}>
        <FileText />
      </div>

      <div className={styles.documentInfo}>
        <strong>{document.title}</strong>
        <span>PDF документ</span>
      </div>

      <a
        href={document.file}
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
