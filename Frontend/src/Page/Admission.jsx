import { useState } from "react";
import axios from "axios";

const AdmissionForm = () => {
  const [formData, setFormData] = useState({
    gre: "",
    toefl: "",
    universityRating: "",
    lor: "",
    cgpa: "",
    research: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        "GRE Score": Number(formData.gre),
        "TOEFL Score": Number(formData.toefl),
        "University Rating": Number(formData.universityRating),
        "LOR ": Number(formData.lor),
        "CGPA": Number(formData.cgpa),
        "Research": Number(formData.research),
      });

      setPrediction(response.data["Chance of Admit"]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-4">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">
        🎓 Admission Predictor
      </h1>

      <form
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg border border-gray-200"
        onSubmit={handleSubmit}
      >
        {/** Form Fields */}
        {[
          { label: "GRE Score", name: "gre" },
          { label: "TOEFL Score", name: "toefl" },
          { label: "University Rating (1-5)", name: "universityRating" },
          { label: "LOR (Letter of Recommendation)", name: "lor", step: "0.1" },
          { label: "CGPA", name: "cgpa", step: "0.1" },
          { label: "Research Experience (0 or 1)", name: "research", step: "1" },
        ].map(({ label, name, step }) => (
          <div key={name} className="mb-4">
            <label className="block text-gray-700 font-medium">{label}</label>
            <input
              type="number"
              name={name}
              value={formData[name]}
              step={step || "1"}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              required
            />
          </div>
        ))}

        {/** Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-3 rounded-lg mt-4 font-semibold hover:bg-indigo-700 transition transform hover:scale-105"
        >
          {loading ? "Predicting..." : "Predict Admission Chance"}
        </button>
      </form>

      {/** Prediction Result */}
      {prediction !== null && (
        <div className="mt-6 bg-green-100 p-6 rounded-lg shadow-md text-center border border-green-300">
          <h2 className="text-xl font-semibold text-green-700">🎯 Prediction Result:</h2>
          <p className="text-2xl font-bold text-green-800">
            {(prediction * 100).toFixed(2)}% Chance of Admission
          </p>
        </div>
      )}
    </div>
  );
};

export default AdmissionForm;
