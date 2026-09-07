"use client";

import { useEffect, useState } from "react";
import { Search, X, User, Phone, Check, Loader2 } from "lucide-react";

import styles from "./AddTarrifModal.module.css";

const MOCK_USERS = [
  {
    id: 101,
    name: "Азизбек Маматов",
    phone: "+996 555 123 456",
  },
  {
    id: 102,
    name: "Нурбек Садыков",
    phone: "+996 700 456 789",
  },
  {
    id: 103,
    name: "Айдана Токтосунова",
    phone: "+996 777 321 654",
  },
  {
    id: 104,
    name: "Бекзат Абдрахманов",
    phone: "+996 550 987 321",
  },
  {
    id: 105,
    name: "Эльдар Осмонов",
    phone: "+996 501 222 333",
  },
  {
    id: 106,
    name: "Мээрим Исакова",
    phone: "+996 707 444 555",
  },
  {
    id: 107,
    name: "Самат Касымов",
    phone: "+996 555 777 888",
  },
];

export default function AddTariffModal({ isOpen, onClose, onSubmit }) {
  const [phone, setPhone] = useState("");
  const [users, setUsers] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    activeListings: "",
    vipBoosts: "",
    topBoosts: "",
  });

  useEffect(() => {
    if (!isOpen) {
      setPhone("");
      setUsers([]);
      setSearching(false);
      setSearched(false);
      setSelectedUser(null);

      setForm({
        name: "",
        activeListings: "",
        vipBoosts: "",
        topBoosts: "",
      });
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const formatPhone = (value) => {
    let numbers = value.replace(/\D/g, "");

    if (numbers.startsWith("996")) {
      numbers = numbers.slice(3);
    }

    if (numbers.startsWith("0")) {
      numbers = numbers.slice(1);
    }

    numbers = numbers.slice(0, 9);

    let result = "+996";

    if (numbers.length > 0) {
      result += ` ${numbers.slice(0, 3)}`;
    }

    if (numbers.length > 3) {
      result += ` ${numbers.slice(3, 6)}`;
    }

    if (numbers.length > 6) {
      result += ` ${numbers.slice(6, 9)}`;
    }

    return result;
  };

  const handlePhoneChange = (event) => {
    const value = event.target.value;

    setPhone(formatPhone(value));

    setSelectedUser(null);
    setUsers([]);
    setSearched(false);
  };

  const handleSearch = () => {
    const searchNumbers = phone.replace(/\D/g, "");

    if (searchNumbers.length < 9) {
      setUsers([]);
      setSearched(true);
      return;
    }

    setSearching(true);
    setSearched(false);
    setUsers([]);

    setTimeout(() => {
      const normalizedSearch = searchNumbers.slice(-9);

      const results = MOCK_USERS.filter((user) => {
        const normalizedUserPhone = user.phone.replace(/\D/g, "").slice(-9);

        return normalizedUserPhone.includes(normalizedSearch);
      });

      setUsers(results);
      setSearching(false);
      setSearched(true);
    }, 500);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setPhone(user.phone);
    setUsers([]);
    setSearched(false);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedUser) {
      return;
    }

    const tariff = {
      userId: selectedUser.id,
      userName: selectedUser.name,
      phone: selectedUser.phone,

      name: form.name.trim(),

      activeListings: Number(form.activeListings) || 0,

      vipBoosts: Number(form.vipBoosts) || 0,

      topBoosts: Number(form.topBoosts) || 0,
    };

    try {
      if (onSubmit) {
        await onSubmit(tariff);
      }

      onClose();
    } catch (error) {
      console.error("Ошибка выдачи тарифа:", error);
    }
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={styles.modal}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <div>
            <div className={styles.eyebrow}>УПРАВЛЕНИЕ ТАРИФАМИ</div>

            <h2>Добавить тариф</h2>

            <p>Найдите пользователя и настройте условия тарифа.</p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Пользователь</div>

              <label className={styles.label}>Номер телефона</label>

              <div className={styles.searchRow}>
                <div className={styles.inputWrapper}>
                  <Phone size={19} />

                  <input
                    type="text"
                    value={phone}
                    onChange={handlePhoneChange}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleSearch();
                      }
                    }}
                    placeholder="+996 XXX XXX XXX"
                  />
                </div>

                <button
                  type="button"
                  className={styles.searchButton}
                  onClick={handleSearch}
                  disabled={searching}
                >
                  {searching ? (
                    <Loader2 size={19} className={styles.spinner} />
                  ) : (
                    <Search size={19} />
                  )}
                  Искать
                </button>
              </div>

              {searching && (
                <div className={styles.results}>
                  <div className={styles.resultsLoading}>
                    <Loader2 size={19} className={styles.spinner} />
                    Поиск пользователей...
                  </div>
                </div>
              )}

              {!searching && searched && users.length === 0 && (
                <div className={styles.results}>
                  <div className={styles.noResults}>
                    Пользователи не найдены
                  </div>
                </div>
              )}

              {!searching && users.length > 0 && (
                <div className={styles.results}>
                  {users.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      className={styles.userResult}
                      onClick={() => handleSelectUser(user)}
                    >
                      <div className={styles.userAvatar}>
                        <User size={20} />
                      </div>

                      <div className={styles.userInfo}>
                        <strong>{user.name}</strong>

                        <span>{user.phone}</span>
                      </div>

                      <span className={styles.resultArrow}>→</span>
                    </button>
                  ))}
                </div>
              )}

              {selectedUser && (
                <div className={styles.selectedUser}>
                  <div className={styles.selectedIcon}>
                    <Check size={19} />
                  </div>

                  <div className={styles.selectedInfo}>
                    <strong>{selectedUser.name}</strong>

                    <span>{selectedUser.phone}</span>
                  </div>

                  <span className={styles.selectedBadge}>Выбран</span>
                </div>
              )}
            </div>

            <div className={styles.section}>
              <div className={styles.sectionTitle}>Параметры тарифа</div>

              <div className={styles.field}>
                <label className={styles.label}>Название тарифа</label>

                <input
                  type="text"
                  className={styles.input}
                  value={form.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  placeholder="Например, Premium"
                  required
                />
              </div>

              <div className={styles.grid}>
                <div className={styles.field}>
                  <label className={styles.label}>Активные объявления</label>

                  <input
                    type="number"
                    min="0"
                    className={styles.input}
                    value={form.activeListings}
                    onChange={(event) =>
                      handleChange("activeListings", event.target.value)
                    }
                    placeholder="0"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Поднятия в VIP</label>

                  <input
                    type="number"
                    min="0"
                    className={styles.input}
                    value={form.vipBoosts}
                    onChange={(event) =>
                      handleChange("vipBoosts", event.target.value)
                    }
                    placeholder="0"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Поднятия в TOP</label>

                  <input
                    type="number"
                    min="0"
                    className={styles.input}
                    value={form.topBoosts}
                    onChange={(event) =>
                      handleChange("topBoosts", event.target.value)
                    }
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Номер телефона пользователя
                </label>

                <div className={styles.readonlyInput}>
                  <Phone size={18} />

                  <span>
                    {selectedUser
                      ? selectedUser.phone
                      : "Сначала выберите пользователя"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Отмена
            </button>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={!selectedUser || !form.name.trim()}
            >
              <Check size={19} />
              Выдать тариф
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
