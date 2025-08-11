import { useState } from "react";
import "./App.css";
import {
  VaHeaderMinimal,
  VaButton,
  VaSelect,
  VaTextInput,
  VaTextarea,
  VaLoadingIndicator,
} from "@department-of-veterans-affairs/component-library/dist/react-bindings";
// import sampleData from "./Sample.json";

function App() {
  const [formData, setFormData] = useState({
    analysis_type: "",
    condition: "",
    narrative: "",
  });

  const [error, setError] = useState({
    analysisError: "",
    narrativeError: "",
    conditionError: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [feedback, setFeedback] = useState("");

  // const apiURL =
  //   "https://7zz3xzmge3.execute-api.us-east-1.amazonaws.com/main/postform";
  const devApiURL = "/.netlify/functions/api-proxy";
  // const apiKey = import.meta.env.VITE_API_KEY;

  const postForm = async (data) => {
    try {
      const response = await fetch(devApiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setFeedback({
          analysis_result: {
            body: "Sorry we are unable to process your request at this time. Please try again later.",
          },
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      setFeedback(JSON.parse(result.body));
      setIsLoading(false);
      return result;
    } catch (error) {
      setFeedback({
        analysis_result: {
          body: "Sorry we are unable to process your request at this time. Please try again later.",
        },
      });

      setIsLoading(false);
      throw error;
    }
  };

  const resetForm = () => {
    setFeedback("");
    setFormData({
      analysis_type: "",
      condition: "",
      narrative: "",
    });
    setError({
      analysisError: "",
      narrativeError: "",
      conditionError: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newError = { analysisError: "", narrativeError: "" };

    if (!formData.analysis_type) {
      newError.analysisError = "Please select a document type.";
      isValid = false;
    }

    if (!formData.narrative) {
      newError.narrativeError = "Narrative is required.";
      isValid = false;
    }

    if (!formData.condition && formData.analysis_type === "va_appeal") {
      newError.conditionError = "Condition is required.";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      postForm(formData);
    }
  };

  const showFeedback = () => {
    const formatText = (str) =>
      str
        .split("\n")
        .filter((x) => x !== ``)
        .filter((x) => x !== `---`);
    const feedbackBody = feedback.analysis_result?.body;
    return isLoading ? (
      <div className="vads-u-margin-y--4">
        <VaLoadingIndicator
          message={"Processing your request..."}
          className="vads-u-margin-top--2"
        />
      </div>
    ) : (
      <div className="vads-u-padding--4">
        <h1>Your narrative feedback:</h1>
        {formatText(feedbackBody).map((line, index) => (
          <p key={index} className="vads-u-margin-bottom--2">
            {line}
          </p>
        ))}
        <VaButton text="Submit another narrative" onClick={resetForm} />
      </div>
    );
  };

  return (
    <>
      <div className="vads-u-background-color--primary-darker">
        <VaHeaderMinimal header="AdvocateAI - Narrative Analysis Tool" />
      </div>
      {!isLoading && !feedback ? (
        <main className="vads-u-padding-x--4">
          <h1 className="vads-u-margin-top--2 vads-u-font-size--h2 vads-font-family-serif">
            Narrative Feedback Form
          </h1>
          <form
            className="vads-u-margin-x--auto"
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <VaSelect
              className="vads-u-margin-y--3"
              onVaSelect={(e) => handleChange(e)}
              label="Select the document type to analyze"
              message-aria-describedby="Optional description text for screen readers"
              name="analysis_type"
              value={formData.analysis_type}
              error={error.analysisError}
              required
            >
              <option value="va_appeal">VA Appeal</option>
              <option value="sec_10k">Form 10-K</option>
            </VaSelect>

            <VaTextInput
              label="Please state your condition"
              className={
                error.conditionError
                  ? "vads-u-margin-y--3"
                  : "vads-u-margin-y--2"
              }
              name="condition"
              error={error.conditionError}
              onInput={(e) => handleChange(e)}
            />

            <VaTextarea
              label="Please enter your narrative"
              className={
                error.narrativeError
                  ? "vads-u-margin-y--3"
                  : "vads-u-margin-y--2"
              }
              required
              label-header-level={null}
              message-aria-describedby="Optional description text for screen readers"
              name="narrative"
              onInput={(e) => handleChange(e)}
              error={error.narrativeError}
            />

            <VaButton
              className="vads-u-margin-y--2"
              text="Submit"
              submit="prevent"
            />
          </form>
        </main>
      ) : (
        showFeedback()
      )}
    </>
  );
}

export default App;
