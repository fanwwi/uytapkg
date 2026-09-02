"use client";

import { useEffect, useRef, useState } from "react";
import { X, Upload, Link as LinkIcon, CalendarDays, AlertCircle, LoaderCircle } from "lucide-react";

import styles from "./BannerForm.module.css";
import { uploadBannerImage } from "@/utils/api";

const emptyForm = {
  title: "",
  imageUrl: "",
  link: "",
  startDate: "",
  endDate: "",
  imagePositionX: 50,
  imagePositionY: 50,
};

export default function BannerForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState("");

  const [position, setPosition] = useState({
    x: 50,
    y: 50,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);

  const dragRef = useRef({
    startX: 0,
    startY: 0,
    startPositionX: 50,
    startPositionY: 50,
  });

  const previewRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      const x = initialData.imagePositionX ?? 50;
      const y = initialData.imagePositionY ?? 50;

      setForm({
        title: initialData.title || "",
        imageUrl: initialData.imageUrl || "",
        link: initialData.link || "",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
        imagePositionX: x,
        imagePositionY: y,
      });

      setPreview(initialData.imageUrl || "");

      setPosition({
        x,
        y,
      });
    } else {
      setForm(emptyForm);
      setPreview("");

      setPosition({
        x: 50,
        y: 50,
      });
    }

    setUploadError("");
    setSubmitError("");
    setUploading(false);
    setSaving(false);
  }, [initialData]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Пожалуйста, выберите изображение.");
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setUploadError("Размер изображения не должен превышать 10 МБ.");
      return;
    }

    setUploadError("");

    // Локальный blob — только для предпросмотра и позиционирования,
    // на сервер он не отправляется.
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    setPosition({ x: 50, y: 50 });
    setForm((prev) => ({
      ...prev,
      imageUrl: "",
      imagePositionX: 50,
      imagePositionY: 50,
    }));

    setUploading(true);

    try {
      const token = localStorage.getItem("uytap_token");
      const { url } = await uploadBannerImage(token, file);

      setForm((prev) => ({
        ...prev,
        imageUrl: url,
      }));
    } catch (error) {
      setUploadError(error.message || "Не удалось загрузить изображение");
      setPreview("");
    } finally {
      setUploading(false);
    }
  }

  function removeImage() {
    setPreview("");
    setUploadError("");

    setPosition({
      x: 50,
      y: 50,
    });

    setForm((prev) => ({
      ...prev,
      imageUrl: "",
      imagePositionX: 50,
      imagePositionY: 50,
    }));
  }

  function startDrag(clientX, clientY) {
    setIsDragging(true);

    dragRef.current = {
      startX: clientX,
      startY: clientY,
      startPositionX: position.x,
      startPositionY: position.y,
    };
  }

  function moveDrag(clientX, clientY) {
    if (!isDragging || !previewRef.current) return;

    const rect = previewRef.current.getBoundingClientRect();

    const deltaX = clientX - dragRef.current.startX;
    const deltaY = clientY - dragRef.current.startY;

    /*
      Переводим движение мыши в проценты.

      Коэффициент немного увеличен,
      чтобы изображение ощущалось естественно
      при перетаскивании.
    */

    const sensitivityX = 100 / rect.width;
    const sensitivityY = 100 / rect.height;

    const nextX = dragRef.current.startPositionX - deltaX * sensitivityX;

    const nextY = dragRef.current.startPositionY - deltaY * sensitivityY;

    const clampedX = Math.max(0, Math.min(100, nextX));
    const clampedY = Math.max(0, Math.min(100, nextY));

    setPosition({
      x: clampedX,
      y: clampedY,
    });

    setForm((prev) => ({
      ...prev,
      imagePositionX: clampedX,
      imagePositionY: clampedY,
    }));
  }

  function stopDrag() {
    setIsDragging(false);
  }

  function handleMouseDown(event) {
    if (event.button !== 0) return;

    event.preventDefault();

    startDrag(event.clientX, event.clientY);
  }

  function handleMouseMove(event) {
    moveDrag(event.clientX, event.clientY);
  }

  function handleTouchStart(event) {
    const touch = event.touches[0];

    if (!touch) return;

    startDrag(touch.clientX, touch.clientY);
  }

  function handleTouchMove(event) {
    const touch = event.touches[0];

    if (!touch) return;

    event.preventDefault();

    moveDrag(touch.clientX, touch.clientY);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitError("");

    if (!form.title.trim()) {
      setSubmitError("Введите название баннера");
      return;
    }

    if (uploading) {
      setSubmitError("Дождитесь окончания загрузки изображения");
      return;
    }

    if (!form.imageUrl.trim()) {
      setSubmitError("Добавьте изображение баннера");
      return;
    }

    if (!form.startDate) {
      setSubmitError("Выберите дату начала");
      return;
    }

    if (form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
      setSubmitError("Дата окончания не может быть раньше даты начала");
      return;
    }

    setSaving(true);

    try {
      await onSubmit({
        ...form,
        imagePositionX: position.x,
        imagePositionY: position.y,
        endDate: form.endDate || null,
      });
    } catch (error) {
      setSubmitError(error.message || "Не удалось сохранить баннер");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div>
            <h2>
              {initialData ? "Редактирование баннера" : "Добавление баннера"}
            </h2>

            <p>Настройте изображение, ссылку и срок размещения</p>
          </div>

          <button type="button" className={styles.close} onClick={onCancel}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            {/* TITLE */}

            <div className={styles.field}>
              <label>Название баннера</label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Например: Ипотека от Optima Bank"
              />
            </div>

            {/* IMAGE */}

            <div className={styles.field}>
              <label>Изображение баннера</label>

              <div className={styles.bannerHint}>
                <span>Формат баннера</span>
                <strong>728 × 90 px</strong>
              </div>

              <div
                ref={previewRef}
                className={`${styles.bannerPreview} ${
                  isDragging ? styles.dragging : ""
                }`}
                onMouseDown={preview ? handleMouseDown : undefined}
                onMouseMove={preview ? handleMouseMove : undefined}
                onMouseUp={stopDrag}
                onMouseLeave={stopDrag}
                onTouchStart={preview ? handleTouchStart : undefined}
                onTouchMove={preview ? handleTouchMove : undefined}
                onTouchEnd={stopDrag}
              >
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Предпросмотр баннера"
                      draggable="false"
                      style={{
                        objectPosition: `${position.x}% ${position.y}%`,
                      }}
                    />

                    {uploading && (
                      <div className={styles.uploadingOverlay}>
                        <LoaderCircle className={styles.spinIcon} />
                        <span>Загружаем...</span>
                      </div>
                    )}

                    <div className={styles.dragOverlay}>
                      <span>Перетащите изображение</span>
                    </div>

                    <button
                      type="button"
                      className={styles.removeImage}
                      onClick={(event) => {
                        event.stopPropagation();
                        removeImage();
                      }}
                      title="Удалить изображение"
                    >
                      <X />
                    </button>
                  </>
                ) : (
                  <label className={styles.uploadButton}>
                    <Upload />

                    <strong>Перетащите изображение сюда</strong>

                    <span>или нажмите, чтобы выбрать файл</span>

                    <small>PNG, JPG или WEBP · до 10 МБ</small>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>

              {uploadError && (
                <div className={styles.fieldError}>
                  <AlertCircle size={14} />
                  {uploadError}
                </div>
              )}

              {preview && !uploading && (
                <div className={styles.imageInstruction}>
                  <span>
                    Зажмите изображение и перетащите его, чтобы выбрать нужную
                    область.
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setPosition({
                        x: 50,
                        y: 50,
                      });

                      setForm((prev) => ({
                        ...prev,
                        imagePositionX: 50,
                        imagePositionY: 50,
                      }));
                    }}
                  >
                    Сбросить позицию
                  </button>
                </div>
              )}
            </div>

            {/* LINK */}

            <div className={styles.field}>
              <label>Ссылка при нажатии</label>

              <div className={styles.inputIcon}>
                <LinkIcon />

                <input
                  name="link"
                  value={form.link}
                  onChange={handleChange}
                  placeholder="https://example.com или /complexes"
                />
              </div>

              <small>
                Пользователь перейдёт по этой ссылке при клике на баннер.
                Допустимы только адреса, начинающиеся с / или http(s)://.
              </small>
            </div>

            {/* DATES */}

            <div className={styles.dateGrid}>
              <div className={styles.field}>
                <label>Дата начала</label>

                <div className={styles.inputIcon}>
                  <CalendarDays />

                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label>Дата окончания</label>

                <div className={styles.inputIcon}>
                  <CalendarDays />

                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                  />
                </div>

                <small>Оставьте пустым для бессрочного размещения.</small>
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            {submitError && (
              <div className={styles.fieldError} style={{ marginRight: "auto" }}>
                <AlertCircle size={14} />
                {submitError}
              </div>
            )}

            <button
              type="button"
              className={styles.cancelButton}
              onClick={onCancel}
              disabled={saving}
            >
              Отмена
            </button>

            <button type="submit" className={styles.submitButton} disabled={saving || uploading}>
              {saving
                ? "Сохраняем..."
                : initialData
                  ? "Сохранить изменения"
                  : "Добавить баннер"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
