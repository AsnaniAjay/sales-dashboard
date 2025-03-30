// src/components/marketing/AttributionSelector.jsx
import React, { useState } from "react";
import { AdjustmentsIcon } from "@heroicons/react/outline";
import Card from "../cards/Card";

const AttributionSelector = ({ onModelChange, initialModel = "lastClick" }) => {
  const [selectedModel, setSelectedModel] = useState(initialModel);

  // Attribution models with descriptions
  const attributionModels = [
    {
      id: "lastClick",
      name: "Last Click",
      description:
        "Attributes 100% of the conversion value to the last touchpoint",
      impact: "Favors channels closer to conversion (e.g., direct, search)",
    },
    {
      id: "firstClick",
      name: "First Click",
      description:
        "Attributes 100% of the conversion value to the first touchpoint",
      impact: "Favors awareness channels (e.g., social, display)",
    },
    {
      id: "linear",
      name: "Linear",
      description: "Distributes credit equally across all touchpoints",
      impact: "Balanced view of all channels in the customer journey",
    },
    {
      id: "timeDecay",
      name: "Time Decay",
      description: "Attributes more credit to touchpoints closer to conversion",
      impact: "Emphasizes recent interactions but recognizes earlier ones",
    },
    {
      id: "positionBased",
      name: "Position Based",
      description:
        "40% to first and last touchpoints, 20% distributed among others",
      impact: "Emphasizes discovery and conversion points",
    },
  ];

  // Handle model change
  const handleModelChange = (modelId) => {
    setSelectedModel(modelId);
    if (onModelChange) {
      onModelChange(modelId);
    }
  };

  // Get the selected model details
  const selectedModelDetails = attributionModels.find(
    (model) => model.id === selectedModel
  );

  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Attribution Model
            </h3>
            <p className="text-sm text-gray-500">
              Choose how conversion credit is distributed across touchpoints
            </p>
          </div>
          <div className="bg-indigo-100 rounded-full p-2">
            <AdjustmentsIcon className="h-6 w-6 text-indigo-600" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
          {attributionModels.map((model) => (
            <button
              key={model.id}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedModel === model.id
                  ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
              onClick={() => handleModelChange(model.id)}
            >
              {model.name}
            </button>
          ))}
        </div>

        {/* Selected model description */}
        {selectedModelDetails && (
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm font-medium text-gray-900">
              {selectedModelDetails.name}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {selectedModelDetails.description}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              <span className="font-medium">Impact:</span>{" "}
              {selectedModelDetails.impact}
            </p>
          </div>
        )}

        {/* Attribution model diagram */}
        <div className="mt-4">
          <div className="relative pt-1">
            {/* Attribution flow visualization */}
            <div className="flex justify-between mb-2">
              <div className="text-xs text-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                  <span className="text-blue-700 font-medium">Ad</span>
                </div>
                <p className="mt-1">First Touch</p>
              </div>

              <div className="text-xs text-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mx-auto">
                  <span className="text-indigo-700 font-medium">Blog</span>
                </div>
                <p className="mt-1">Engage</p>
              </div>

              <div className="text-xs text-center">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                  <span className="text-purple-700 font-medium">Email</span>
                </div>
                <p className="mt-1">Nurture</p>
              </div>

              <div className="text-xs text-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <span className="text-green-700 font-medium">Sale</span>
                </div>
                <p className="mt-1">Last Touch</p>
              </div>
            </div>

            {/* Weight indicator based on model */}
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              {selectedModel === "lastClick" && (
                <div className="flex h-full">
                  <div className="w-1/4 bg-gray-300"></div>
                  <div className="w-1/4 bg-gray-300"></div>
                  <div className="w-1/4 bg-gray-300"></div>
                  <div className="w-1/4 bg-green-500"></div>
                </div>
              )}

              {selectedModel === "firstClick" && (
                <div className="flex h-full">
                  <div className="w-1/4 bg-blue-500"></div>
                  <div className="w-1/4 bg-gray-300"></div>
                  <div className="w-1/4 bg-gray-300"></div>
                  <div className="w-1/4 bg-gray-300"></div>
                </div>
              )}

              {selectedModel === "linear" && (
                <div className="flex h-full">
                  <div className="w-1/4 bg-blue-500"></div>
                  <div className="w-1/4 bg-indigo-500"></div>
                  <div className="w-1/4 bg-purple-500"></div>
                  <div className="w-1/4 bg-green-500"></div>
                </div>
              )}

              {selectedModel === "timeDecay" && (
                <div className="flex h-full">
                  <div className="w-1/4 bg-blue-300"></div>
                  <div className="w-1/4 bg-indigo-400"></div>
                  <div className="w-1/4 bg-purple-500"></div>
                  <div className="w-1/4 bg-green-600"></div>
                </div>
              )}

              {selectedModel === "positionBased" && (
                <div className="flex h-full">
                  <div className="w-1/4 bg-blue-500"></div>
                  <div className="w-1/4 bg-indigo-300"></div>
                  <div className="w-1/4 bg-purple-300"></div>
                  <div className="w-1/4 bg-green-500"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AttributionSelector;
