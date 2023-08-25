import React from 'react';
import { getDictionaryValueOrKey } from '../../../../../../../utils/utils';
import Link from '../../../../Widgets/Link';

function TrackColumn({ line, config }) {
  return (
    <Link variant="track" href={'#'} underline="underline-none">
      {getDictionaryValueOrKey(config?.orderLineDetails?.trackLabel)}
    </Link>
  );
}
export default TrackColumn;
