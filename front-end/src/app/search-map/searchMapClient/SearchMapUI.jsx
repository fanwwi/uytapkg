"use client";

import {
  MapPin,
  X,
  RotateCcw,
  MousePointer2,
  ArrowUpRight,
  Home,
  SlidersHorizontal,
  Building2,
  Tag,
  Loader2,
  SquareDashedMousePointer,
} from "lucide-react";

import styles from "../Map.module.css";

import CustomSelect from "@/components/ui/customSelect/CustomSelect";

export default function SearchMapUI({
  router,
  t,

  showFilters,
  setShowFilters,

  activeFilterCount,
  clearFilters,

  hasSelection,
  clearSelection,

  dealOptions,
  propertyOptions,
  locationOptions,

  dealFilter,
  setDealFilter,

  propertyFilter,
  setPropertyFilter,

  locationFilter,
  setLocationFilter,

  loading,
  loadError,

  isAreaMode,
  startAreaSelection,
  cancelAreaSelection,

  isDrawing,

  filteredObjects,

  previewObject,
  closeObjectPreview,

  detailsLoading,
  detailsError,

  getDisplayPrice,
  getObjectTypeLabel,
  handleDetails,
}) {
  function handlePreviewClick(event) {
    if (event.target.closest(`.${styles.detailsButton}`)) {
      return;
    }

    if (!previewObject?.id) {
      return;
    }

    handleDetails(previewObject);
  }

  return (
    <>
      <div className={styles.topPanel}>
        <button
          type="button"
          className={styles.homeButton}
          onClick={() => router.push("/")}
          aria-label={t("searchMap.home")}
        >
          <Home size={18} />

          <span>{t("searchMap.home")}</span>
        </button>

        <div className={styles.heading}>
          <div className={styles.headingIcon}>
            <MapPin />
          </div>

          <div>
            <span>UYTAP MAP</span>

            <h1>{t("searchMap.title")}</h1>
          </div>
        </div>

        <button
          type="button"
          className={`${styles.filtersToggle} ${
            showFilters || activeFilterCount > 0
              ? styles.filtersToggleActive
              : ""
          }`}
          onClick={() => setShowFilters((prev) => !prev)}
        >
          <SlidersHorizontal />

          <span>{t("searchMap.filters.title")}</span>

          {activeFilterCount > 0 && <b>{activeFilterCount}</b>}
        </button>
      </div>

      <div
        className={`${styles.filtersPanel} ${
          showFilters ? styles.filtersPanelOpen : ""
        }`}
      >
        <div className={styles.filtersHeader}>
          <div>
            <strong>{t("searchMap.filters.searchFilters")}</strong>

            <span>{t("searchMap.filters.description")}</span>
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              className={styles.clearFilters}
              onClick={() => {
                clearFilters();

                if (hasSelection) {
                  clearSelection();
                }
              }}
            >
              <RotateCcw size={14} />

              {t("searchMap.filters.reset")}
            </button>
          )}
        </div>

        <div className={styles.filtersGrid}>
          <CustomSelect
            icon={Tag}
            title={t("searchMap.filters.dealType")}
            options={dealOptions}
            value={dealFilter}
            setValue={setDealFilter}
          />

          <CustomSelect
            icon={Building2}
            title={t("searchMap.filters.propertyType")}
            options={propertyOptions}
            value={propertyFilter}
            setValue={setPropertyFilter}
          />

          <CustomSelect
            icon={MapPin}
            title={t("searchMap.filters.location")}
            options={locationOptions}
            value={locationFilter}
            setValue={setLocationFilter}
          />
        </div>
      </div>

      {loading && (
        <div className={styles.mapStatus}>
          <div className={styles.loadingSpinner} />

          <span>{t("searchMap.loading.objects")}</span>
        </div>
      )}

      {!loading && loadError && (
        <div className={styles.mapStatus}>
          <span>{t(loadError)}</span>
        </div>
      )}

      {!loading && (
        <div className={styles.areaSelectionControl}>
          {!isAreaMode ? (
            <button
              type="button"
              className={styles.areaSelectionButton}
              onClick={startAreaSelection}
            >
              <SquareDashedMousePointer size={17} />

              <span>{t("searchMap.area.select")}</span>
            </button>
          ) : (
            <button
              type="button"
              className={`${styles.areaSelectionButton} ${styles.areaSelectionButtonActive}`}
              onClick={cancelAreaSelection}
            >
              <X size={17} />

              <span>{t("searchMap.area.cancel")}</span>
            </button>
          )}
        </div>
      )}

      {isAreaMode && !isDrawing && (
        <div className={styles.areaModeHint}>
          <div className={styles.areaModeHintIcon}>
            <SquareDashedMousePointer />
          </div>

          <div>
            <strong>{t("searchMap.area.modeTitle")}</strong>

            <span>{t("searchMap.area.modeDescription")}</span>
          </div>
        </div>
      )}

      {!isAreaMode && !isDrawing && !hasSelection && (
        <div className={styles.drawHint}>
          <div className={styles.drawHintIcon}>
            <MousePointer2 />
          </div>

          <div>
            <strong>{t("searchMap.area.searchByArea")}</strong>

            <span>{t("searchMap.area.searchByAreaDescription")}</span>
          </div>
        </div>
      )}

      {hasSelection && (
        <div className={styles.selectionPanel}>
          <div className={styles.selectionIcon}>
            <MapPin />
          </div>

          <div className={styles.selectionText}>
            <strong>{t("searchMap.area.selected")}</strong>

            <span>
              {t("searchMap.area.found")} <b>{filteredObjects.length}</b>
            </span>
          </div>

          <button
            type="button"
            className={styles.resetButton}
            onClick={clearSelection}
          >
            <RotateCcw />

            <span>{t("searchMap.filters.reset")}</span>
          </button>
        </div>
      )}

      {previewObject && (
        <div
          className={styles.objectPreview}
          onClick={handlePreviewClick}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              handleDetails(previewObject);
            }
          }}
        >
          <button
            type="button"
            className={styles.previewClose}
            onClick={(event) => {
              event.stopPropagation();
              closeObjectPreview();
            }}
            aria-label={t("searchMap.preview.close")}
          >
            <X />
          </button>

          <div className={styles.previewImage}>
            {previewObject.image ? (
              <img
                src={previewObject.image}
                alt={previewObject.name || t("searchMap.fallback.property")}
              />
            ) : (
              <div className={styles.previewNoImage}>
                <MapPin />
              </div>
            )}

            <span className={styles.previewType}>
              {getObjectTypeLabel(previewObject, t)}
            </span>
          </div>

          <div className={styles.previewContent}>
            <h3>{previewObject.name || t("searchMap.fallback.property")}</h3>

            <p>
              <MapPin />

              <span>
                {previewObject.address || t("searchMap.fallback.address")}
              </span>
            </p>

            <strong>{getDisplayPrice(previewObject)}</strong>

            {detailsLoading && (
              <div className={styles.previewLoading}>
                <Loader2 size={16} className={styles.spinnerIcon} />

                <span>{t("searchMap.loading.information")}</span>
              </div>
            )}

            {!detailsLoading && detailsError && (
              <span className={styles.previewError}>{t(detailsError)}</span>
            )}

            <button
              type="button"
              className={styles.detailsButton}
              onClick={(event) => {
                event.stopPropagation();

                handleDetails(previewObject);
              }}
            >
              <span>{t("searchMap.preview.details")}</span>

              <ArrowUpRight />
            </button>
          </div>
        </div>
      )}

      <div className={styles.resultCount}>
        <span className={styles.resultDot} />
        {filteredObjects.length} {t("searchMap.objects")}
      </div>
    </>
  );
}
