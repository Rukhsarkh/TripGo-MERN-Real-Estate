import React, { useState } from "react";
import {
  Home,
  Castle,
  Warehouse,
  Tent,
  Plane,
  Sailboat,
  TreePine,
  Landmark,
  Tractor,
  Rocket,
  Container,
  Umbrella,
  Sunset,
  Snowflake,
  FactoryIcon,
  MountainSnowIcon,
  TreePalmIcon,
} from "lucide-react";

const categories = [
  {
    icon: Home,
    label: "Tiny Homes",
    key: "tiny-homes",
  },
  {
    icon: Castle,
    label: "Castles",
    key: "castles",
  },
  {
    icon: Warehouse,
    label: "Lofts",
    key: "lofts",
  },
  {
    icon: Tent,
    label: "Camping",
    key: "camping",
  },
  {
    icon: Plane,
    label: "Unique Stays",
    key: "unique-stays",
  },
  {
    icon: Sailboat,
    label: "Boats",
    key: "boats",
  },
  {
    icon: TreePine,
    label: "Treehouses",
    key: "treehouses",
  },
  {
    icon: Landmark,
    label: "Historic Homes",
    key: "historic-homes",
  },
  {
    icon: Tractor,
    label: "Farms",
    key: "Tractor",
  },
  {
    icon: Rocket,
    label: "Themed Stays",
    key: "themed-stays",
  },
  {
    icon: Container,
    label: "Container Homes",
    key: "container-homes",
  },
  {
    icon: MountainSnowIcon,
    label: "Mountain Cabins",
    key: "mountain-cabins",
  },
  {
    icon: Umbrella,
    label: "Resort Stays",
    key: "resort-stays",
  },
  {
    icon: Sunset,
    label: "Eco Stays",
    key: "eco-stays",
  },
  {
    icon: Snowflake,
    label: "Ski Chalets",
    key: "ski-chalets",
  },
  {
    icon: FactoryIcon,
    label: "Converted Spaces",
    key: "converted-spaces",
  },
  {
    icon: TreePalmIcon,
    label: "Desert Stays",
    key: "desert-stays",
  },
];

const CategoryIconHeader = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex justify-between space-x-4 md:space-x-6 lg:space-x-8 px-4 py-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.key;

          return (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`
                flex flex-col items-center justify-center 
                group cursor-pointer 
                w-16 md:w-20 lg:w-24 
                transition-all duration-200 ease-in-out
                ${
                  isActive
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 hover:text-black"
                }
              `}
            >
              <Icon
                className={`
                  w-6 h-6
                  m-2 
                  group-hover:scale-110 transition-transform
                `}
              />
              <span className="text-xs md:text-sm text-center">
                {category.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryIconHeader;
