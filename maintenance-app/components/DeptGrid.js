'use client';

import { useState } from 'react';
import { Btn, DeptCards } from './ui';
import { DEPTS } from '../lib/data';

export function DeptGrid() {
  const [showAll, setShowAll] = useState(false);
  return (
    <>
      <DeptCards depts={showAll ? DEPTS : DEPTS.slice(0, 4)} />
      {!showAll ? (
        <div className="mt-8 flex justify-center">
          <Btn as="button" type="button" variant="secondary" onClick={() => setShowAll(true)}>
            Carica altri reparti
          </Btn>
        </div>
      ) : null}
    </>
  );
}
