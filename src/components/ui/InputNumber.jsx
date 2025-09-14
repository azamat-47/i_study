import React from "react";
import { InputNumber } from "antd";

/**
 * Universal NumberInput component
 *
 * @param {string} label - Label matni
 * @param {string} placeholder - Input placeholder
 * @param {function} onChange - Value o'zgarganda event
 * @param {number} value - Input qiymati
 * @param {boolean} disabled - Inputni bloklash
 */
const InputNumberUi = ({
  label,
  placeholder = "",
  value,
  onChange,
  disabled = false,
  ...rest
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="font-medium">{label}</label>}
      <InputNumber
        style={{ width: "100%" }}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={onChange}
        addonAfter="so'm"
        min={0}
        // Formatlash (minglik ajratish)
        formatter={(val) =>
          val
            ? `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            : ""
        }
        // Faqat raqam sifatida saqlash
        parser={(val) => val.replace(/\s?/g, "")}
        {...rest}
      />
    </div>
  );
};

export default InputNumberUi;
