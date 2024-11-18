import React, { useState, useEffect } from "react";
import axios from "axios";
import { AlertCircle, CheckCircle, MinusCircle } from "lucide-react";

const SentimentBar = ({ percentage, colorClass }) => (
  <div className="w-full h-4 bg-gray-200 overflow-hidden rounded-md">
    <div
      className={`h-full ${colorClass} rounded-md`}
      style={{ width: `${percentage}%` }}
    ></div>
  </div>
);

const SentimentAnalysis = ({ listingId }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/${listingId}/analyzeListing`,
          {
            withCredentials: true,
            signal: controller.signal,
          }
        );

        if (isMounted) {
          setAnalysis(response.data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.details || err.message);
          setLoading(false);
        }
      }
    };

    fetchAnalysis();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [listingId]);

  const SentimentCard = ({ title, percentage, icon: Icon, colorClass }) => (
    <div className="space-y-2 p-2">
      <div className="flex items-center justify-between gap-60">
        <div className="flex items-center gap-3">
          <Icon
            className={`w-5 h-5 ${
              colorClass.includes("green")
                ? "text-green-600"
                : colorClass.includes("yellow")
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          />
          <span className="font-medium">{title}</span>
        </div>
        <span className="font-bold text-xl">{percentage}%</span>
      </div>
      <SentimentBar
        percentage={percentage}
        colorClass={
          colorClass.includes("green")
            ? "bg-green-500"
            : colorClass.includes("yellow")
            ? "bg-yellow-500"
            : "bg-red-500"
        }
      />
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-pulse text-lg">Analyzing reviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        <span>Error: {error}</span>
      </div>
    );
  }

  if (!analysis) {
    return <div className="p-4 text-gray-600">No analysis available</div>;
  }

  return (
    <div className="w-full p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Review Analysis →</h2>{" "}
        <p className="text-sm">Based on {analysis.totalReviews} reviews</p>
        <div className="text-lg mb-1 text-primary">
          Average Rating: {analysis.averageRating} ⭐
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-6">
          <SentimentCard
            title="Positive"
            percentage={analysis.sentimentDistribution.positive}
            icon={CheckCircle}
            colorClass="bg-green-50 border-green-200"
          />

          <SentimentCard
            title="Neutral"
            percentage={analysis.sentimentDistribution.neutral}
            icon={MinusCircle}
            colorClass="bg-yellow-50 border-yellow-200"
          />

          <SentimentCard
            title="Negative"
            percentage={analysis.sentimentDistribution.negative}
            icon={AlertCircle}
            colorClass="bg-red-50 border-red-200"
          />
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;
