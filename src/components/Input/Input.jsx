import styles from "./Input.module.css";

const Input = ({ type, label, placeholder, clearData, keyPress, value, setValue, handleChange, ...otherProps }) => {
  return (
    <div className={styles.input_wrapper}>
      <label htmlFor={otherProps.id}>{label}</label>
      <input className={styles.input} type={type} onKeyDown={keyPress} value={value} id={otherProps.id} placeholder={placeholder} onChange={handleChange} onClick={clearData} {...otherProps} />
    </div>
  );
};

export default Input;
