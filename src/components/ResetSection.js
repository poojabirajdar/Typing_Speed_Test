import React from "react";

const ResetSection = ({ toTypedArr, questionCount, resetHandler }) => {
  return (
    <div className="reset__section">
      <div className="array__section">
        {toTypedArr.map((el, id) => (
          <span
            className={
              id === questionCount
                ? "current"
                : id < questionCount
                ? "completed"
                : "upcoming"
            }
            key={id}
          >
            {el}
          </span>
        ))}
      </div>
      <button className="reset__btn" onClick={resetHandler}>
        Reset
      </button>
    </div>
  );
};

export default ResetSection;
