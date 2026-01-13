import "./FeedbackMessage.css";

function FeedbackMessage({ message, isSuccess }) {
  if (!message) return null;

  return (
    <div className={`feedback-message ${isSuccess ? "success" : "error"}`}>
      {message}
    </div>
  );
}

export default FeedbackMessage;
