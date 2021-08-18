import React from "react";

function QuotePreviewNote({ note }) {
  // [ heaerLabel, setupRequiredLabel, attachmentRequiredLabel ] = note;
  console.log(note);
  return (
    <section className="cmp-notes-container">  
        <span>{note.headerLabel}</span>
        <div className="cmp-notes-actions">
       
          <span className="cmp-notes-actions--setup">
            <i class="fas fa-cog icon"></i>
            {note.setupRequiredLabel}</span>
          <span className="cmp-notes-actions--attachment">
            <i class="fas fa-plus icon"></i>
            {note.attachmentRequiredLabel}</span>
        </div>
    </section>
  );
}

export default QuotePreviewNote;