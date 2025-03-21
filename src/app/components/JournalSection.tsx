import React from "react";

interface JournalSectionProps {
  title: string;
  items: string[];
  prefixText?: string;
}

const JournalSection: React.FC<JournalSectionProps> = ({
  title,
  items,
  prefixText,
}) => {
  return (
    <div className="mb-6 animate-fadeIn">
      <h3 className="text-lg font-medium mb-2 text-accent font-soft">
        {title}
      </h3>
      <div className="space-y-2">
        {items.map((item, i) =>
          item.trim() ? (
            <div
              key={i}
              className="p-3 bg-white/60 rounded-lg shadow-soft border border-primary/10 animate-fadeIn"
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            >
              {prefixText && (
                <span className="text-accent/80">{prefixText}: </span>
              )}
              {item}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default JournalSection;
