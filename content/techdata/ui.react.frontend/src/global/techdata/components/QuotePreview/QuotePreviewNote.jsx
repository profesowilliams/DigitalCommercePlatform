import React from "react";

function QuotePreviewNote({ note }) {
  const { headerLabel, setupRequiredLabel, attachmentRequiredLabel } = note;
  return (
    <section className="cmp-notes-container">
      <span>{headerLabel}</span>
      <div className="cmp-notes-actions">
        <span className="cmp-notes-actions--setup">
          <i className="fas fa-cog icon"></i>
          {setupRequiredLabel}
        </span>
        <span className="cmp-notes-actions--attachment">
          <i className="fas fa-plus icon"></i>
          {attachmentRequiredLabel}
        </span>
      </div>
    </section>
  );
}

export default QuotePreviewNote;
