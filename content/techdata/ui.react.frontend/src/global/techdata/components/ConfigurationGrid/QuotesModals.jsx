import { useEffect, useState } from 'react';
import React from 'react';
import QuoteDetailsInfo from './QuoteDetailsInfo';

export function QuoteDetailsLink({ configDetailUrl, label, quote }) {
  return (
    <a
      className="cmp-grid-url-underlined"
      href={
        configDetailUrl?.replace('{id}', quote.id)
      }
    >
      {label}{quote.id}
    </a>
  );
}

export function MultipleQuotesInvokeModal({ invokeModal, quotesModal, configDetailUrl, statusLabelsList, line }) {
  return (
    <div
      onClick={() => {
        invokeModal({
          content: (
            <QuoteDetailsInfo
              info={quotesModal.content}
              line={line}
              statusLabelsList={statusLabelsList}
              configDetailUrl={configDetailUrl}
            ></QuoteDetailsInfo>
          ),
          properties: {
            title: `${quotesModal.title}: ${line.configId} `,
          },
        });
      }}
    >
      {statusLabelsList.find((label) => label.labelKey === 'Multiple')?.labelValue}
    </div>
  );
}

export function SingleQuotesInvokeModal({ invokeModal, quotesModal, configDetailUrl, statusLabelsList, line, status }) {
  return (
    <div
      onClick={() => {
        invokeModal({
          content: (
            <QuoteDetailsInfo
              line={line}
              statusLabelsList={statusLabelsList}
              configDetailUrl={configDetailUrl}
              alwaysExpanded={true}
            ></QuoteDetailsInfo>
          ),
          properties: {
            title: `${quotesModal.title}: ${line.configId} `,
          },
        });
      }}
    >
      {status?.labelValue}
    </div>
  );
}
