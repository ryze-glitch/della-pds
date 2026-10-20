'use client';

import { useState } from 'react';
import { Btn, DeptRows } from './ui';
import { DEPTS } from '../lib/data';

export function DeptGrid() {
  const [showAll, setShowAll] = useState(false);
  return (
    <>
      <DeptRows depts={showAll ? DEPTS : DEPTS.slice(0, 4)} />
      {!showAll ? (
        <div className="mt-8">
          <Btn as="button" type="button" variant="outline" icon="arrow-right" onClick={() => setShowAll(true)}>
            Carica altri reparti
          </Btn>
        </div>
      ) : null}
    </>
  );
}
