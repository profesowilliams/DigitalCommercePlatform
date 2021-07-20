import React from "react";

function QuotePreviewNote({ note }) {
  // [ heaerLabel, setupRequiredLabel, attachmentRequiredLabel ] = note;
  console.log(note);
  return (
    <section>
      <div className="cmp-quote-preview__note">
        <span>{note.headerLabel}</span>
        <span>{note.setupRequiredLabel}</span>
        <span>{note.attachmentRequiredLabel}</span>
      </div>
    </section>
  );
}

export default QuotePreviewNote;