import natural from "natural";
import aposToLexForm from "apos-to-lex-form";
import SpellCorrector from "spelling-corrector";
import { removeStopwords } from "stopword";

class PropertyReviewAnalyzer {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.spellCorrector = new SpellCorrector();
    this.spellCorrector.loadDictionary();
    this.analyzer = new natural.SentimentAnalyzer(
      "English",
      natural.PorterStemmer,
      "afinn"
    );
  }

  preprocess(text) {
    // Convert contractions to standard lexicon form
    const lexedText = aposToLexForm(text);

    // Convert to lowercase
    const lowerCase = lexedText.toLowerCase();

    // Remove special characters
    const alphaOnly = lowerCase.replace(/[^a-zA-Z\s]+/g, "");

    // Tokenize
    const tokens = this.tokenizer.tokenize(alphaOnly);

    // Correct spelling
    const spelledTokens = tokens.map((token) =>
      this.spellCorrector.correct(token)
    );

    // Remove stopwords
    const filteredTokens = removeStopwords(spelledTokens);

    return filteredTokens;
  }

  analyzeSentiment(text) {
    const tokens = this.preprocess(text);
    let score = this.analyzer.getSentiment(tokens);

    // Keyword-based adjustments for neutral sentiment
    const neutralKeywords = ["okay", "average", "not bad", "mediocre", "fine"];
    const containsNeutralKeyword = neutralKeywords.some((word) =>
      text.toLowerCase().includes(word)
    );

    if (containsNeutralKeyword) {
      score = Math.max(-0.2, Math.min(0.2, score)); // Nudge score towards neutral
    }

    if (score > 0.5) return "positive";
    if (score < -0.5) return "negative";
    return "neutral";
  }

  async analyzePropertyReviews(propertyReviews) {
    if (!Array.isArray(propertyReviews)) {
      throw new Error("Property reviews must be an array");
    }

    if (propertyReviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        sentimentDistribution: {
          positive: 0,
          neutral: 0,
          negative: 0,
        },
        detailedResults: [],
      };
    }

    try {
      const validReviews = propertyReviews.filter(
        (review) =>
          review &&
          typeof review.comment === "string" &&
          !isNaN(review.rating) &&
          review.rating >= 0 &&
          review.rating <= 5
      );

      if (validReviews.length === 0) {
        throw new Error("No valid reviews found to analyze");
      }

      const results = validReviews.map((review) => {
        const sentiment = this.analyzeSentiment(review.comment);
        return {
          text: review.comment,
          sentiment,
        };
      });

      const totalReviews = results.length;
      const sentimentCounts = {
        positive: 0,
        neutral: 0,
        negative: 0,
      };

      results.forEach((result) => {
        sentimentCounts[result.sentiment]++;
      });

      const averageRating =
        validReviews.reduce((sum, review) => sum + Number(review.rating), 0) /
        totalReviews;

      const analysis = {
        totalReviews,
        averageRating: Number(averageRating.toFixed(2)),
        sentimentDistribution: {
          positive: Number(
            ((sentimentCounts.positive / totalReviews) * 100).toFixed(1)
          ),
          neutral: Number(
            ((sentimentCounts.neutral / totalReviews) * 100).toFixed(1)
          ),
          negative: Number(
            ((sentimentCounts.negative / totalReviews) * 100).toFixed(1)
          ),
        },
        detailedResults: results,
      };

      return analysis;
    } catch (error) {
      console.error("Error in analysis:", error);
      throw new Error(`Analysis failed: ${error.message}`);
    }
  }
}

export default PropertyReviewAnalyzer;
