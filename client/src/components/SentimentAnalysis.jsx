import { useState, useEffect } from "react";
import axios from "axios";
import {
  AlertCircle,
  CheckCircle,
  MinusCircle,
  Star,
  TrendingUp,
} from "lucide-react";
import config from "../config";

const SentimentBar = ({ percentage, colorClass }) => (
  <div className="w-full h-3 md:h-4 bg-gray-200 overflow-hidden rounded-md">
    <div
      className={`h-full ${colorClass} rounded-md transition-all duration-500 ease-in-out`}
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
          `${config.API_URL}/api/${listingId}/analyzeListing`,
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
    <div className="space-y-2 p-2 md:p-3 lg:p-4 bg-gray-50 rounded-lg shadow-lg shadow-gray-300 transition-shadow">
      <div className="flex items-center justify-between gap-2 md:gap-4 lg:gap-6">
        <div className="flex items-center gap-2 md:gap-3">
          <Icon
            className={`w-4 h-4 md:w-5 md:h-5 ${
              colorClass.includes("green")
                ? "text-green-600"
                : colorClass.includes("yellow")
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          />
          <span className="text-sm md:text-base font-medium">{title}</span>
        </div>
        <span className="font-bold text-lg md:text-xl">{percentage}%</span>
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
      <div className="flex items-center justify-center p-4 md:p-6">
        <div className="animate-pulse text-base md:text-lg text-gray-600">
          Analyzing reviews...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 md:p-4 text-red-600 flex items-center gap-2 text-sm md:text-base">
        <AlertCircle className="w-4 h-4 md:w-5 md:h-5" />
        <span>Error: {error}</span>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-3 md:p-4 text-gray-600 text-sm md:text-base">
        No analysis available
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl p-3 md:p-4 lg:p-8 space-y-4 md:space-y-6 shadow-lg shadow-gray-300 rounded-b-xl">
      <div className="space-y-2 md:space-y-4">
        <div className="justify-center items-center inline-flex gap-4">
          <TrendingUp className=" text-primary" size={32} />
          <h2 className="text-lg md:text-2xl font-bold">Review Analysis →</h2>
        </div>

        <div className="flex items-center space-x-4 text-gray-600">
          <p className="text-sm">Based on {analysis.totalReviews} reviews</p>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-base font-semibold">
              {analysis.averageRating} / 5
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 md:space-y-4">
        <div className="space-y-3 md:space-y-4">
          <SentimentCard
            title="Positive Comments"
            percentage={analysis.sentimentDistribution.positive}
            icon={CheckCircle}
            colorClass="bg-green-50 border-green-200"
          />

          <SentimentCard
            title="Neutral Comments"
            percentage={analysis.sentimentDistribution.neutral}
            icon={MinusCircle}
            colorClass="bg-yellow-50 border-yellow-200"
          />

          <SentimentCard
            title="Negative Comments"
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
