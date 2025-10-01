/**
 * Get color for a task tag.
 * @param {string} tag - Task type.
 * @returns {string} - Color for UI.
 */

export const getTagColor = (tag) => {
  switch (tag) {
    case "Routine":
      return "lightskyblue";

    case "Event":
      return "orange";

    case "Deadline":
      return "limegreen";

    case "Other":
      return "lightgray";

    default:
      return "black"; 
  }
};