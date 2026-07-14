import React from "react";

function ContentBlock({
  titleText,
  titleSize = "text-3xl",
  textColor = "text-black",
  textAlign = "text-center",
  textPadding = "mb-1",
  descriptionText,
  descriptionTextSize = "text-sm",
}) {
  const description = descriptionText?.split(".");
  return (
    <div>
      <h1 className={`${titleSize} font-bold capitalize ${textAlign} ${textPadding} ${textColor}`}>{titleText}</h1>
      {descriptionText && (
        <p className={`${descriptionTextSize} text-gray-500 ${textAlign} ${textPadding} `}>
          {description[0]}.<br /> {description[1]}
        </p>
      )}
    </div>
  );
}

export default ContentBlock;
