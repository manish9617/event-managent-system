import React, { useRef } from "react";
import styles from "./Edit.module.css"; // Import CSS module

export default function Edit({
  type,
  values,
  editDetails,
  handleEdit,
  isEdit,
}) {
  const value = useRef();

  const saveData = () => {
    editDetails(type, value.current.value);
    handleEdit("");
  };

  const handleFocus = () => {
    handleEdit(type);
  };

  return (
    <tr
      className={`${styles.edit} p-1 ${
        isEdit === type ? styles["input-focused"] : ""
      }`}
    >
      <td className={`w-25 ${styles["col-label"]}`}>
        <label className={styles.label}>{type} :</label>
      </td>
      <td className={`w-50 ${styles["col-input"]}`}>
        <input
          type="text"
          className={`${styles["input-text"]} form-control ${
            isEdit === type ? styles["border-primary"] : ""
          }`}
          name={type}
          defaultValue={values}
          ref={value}
          disabled={isEdit !== type}
          onFocus={handleFocus}
        />
      </td>
      <td className={`w-25 ms-2 ${styles["col-buttons"]}`}>
        {isEdit !== type && (
          <button
            className="btn btn-secondary"
            onClick={() => handleEdit(type)}
          >
            Edit
          </button>
        )}
        {isEdit === type && (
          <>
            <button className="btn btn-primary me-2" onClick={saveData}>
              Save
            </button>
            <button className="btn btn-danger" onClick={() => handleEdit("")}>
              Cancel
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
