import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";

export default function TaskHookForm({ kisiler, submitFn }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    people: [],
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    setValue, // useForm'dan setValue fonksiyonunu al
  } = useForm({
    mode: "all",
  });

  const handleCheckboxChange = (e) => {
    const { value } = e.target;

    setFormData((prevData) => {
      const updatedPeople = [...prevData.people];
      const index = updatedPeople.indexOf(value);

      if (index > -1) {
        updatedPeople.splice(index, 1);
      } else {
        updatedPeople.push(value);
      }

      return {
        ...prevData,
        people: updatedPeople,
      };
    });
  };

  const onSubmit = (data) => {
    submitFn({
      ...formData,
      id: nanoid(5),
      status: "yapılacak",
      title: data.title, // Güncel başlık verisini kullan
      description: data.description, // Güncel açıklama verisini kullan
    });

    setFormData({
      title: "",
      description: "",
      people: [],
    });

    // Formu sıfırlarken input değerlerini de sıfırla
    notify();
    reset();
  };
  const notify = () => toast("Başarılı Bir Şekilde Eklendi.");

  return (
    <form className="taskForm" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-line">
        <label className="input-label" htmlFor="title">
          Başlık
        </label>
        <input
          className="input-text"
          {...register("title", {
            required: "Zorunlu alan boş bırakmayınız.",
            minLength: {
              value: 3,
              message: "En az 3 karakter girilmelidir.",
            },
          })}
          aria-invalid={errors["title"] ? "true" : "false"}
          placeholder="Başlık giriniz."
          type="text"
          name="title"
        />
        <p className="input-error">
          {errors["title"] && <p role="alert">{errors["title"]?.message}</p>}
        </p>
      </div>

      <div className="form-line">
        <label className="input-label" htmlFor="description">
          Açıklama
        </label>
        <textarea
          className="input-textarea"
          name="description"
          placeholder="Açıklama giriniz."
          {...register("description", {
            required: "Zorunlu alan boş bırakmayınız.",
            minLength: {
              value: 10,
              message: "Enaz 10 karakter girilmelidir.",
            },
          })}
        ></textarea>
        <p className="input-error">
          {errors["description"] && (
            <p role="alert">{errors["description"]?.message}</p>
          )}
        </p>
      </div>
      <div className="form-line">
        <label className="input-label">İnsanlar</label>
        <div>
          {kisiler.map((p) => (
            <label className="input-checkbox" key={p}>
              <input
                type="checkbox"
                value={p}
                {...register("people", {
                  required: "En az birini seçiniz",

                  validate: (values) =>
                    values.length <= 3 || "En fazla 3 kişi seçilebilir.",
                })}
              />
              {p}
            </label>
          ))}
          <p className="input-error">
            {errors["people"] && (
              <p role="alert">{errors["people"]?.message}</p>
            )}
          </p>
        </div>
      </div>

      <div className="form-line">
        <button className="submit-button" type="submit" disabled={!isValid}>
          Kaydet
        </button>
      </div>
    </form>
  );
}
