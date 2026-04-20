// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

// import { InfoIcon } from "lucide-react";
import type React from "react";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DEFAULT_MORA_PITCH,
  type Mora,
  type MoraPitch,
  moraSchema,
  splitByMora,
} from "@/models/mora";
import { createPlaceNameData, type PlaceNameData } from "@/models/place";
import { AccentEditor } from "./accent-editor";

type RelativeEntry = {
  spelling: string;
  reading: string;
  compareKey: string;
};

/**
 * Find the index of the first different element between two arrays.
 *
 * If the arrays are identical, returns -1. If one array is a prefix of the
 * other, returns the length of the shorter array.
 * @param arr1 Array 1.
 * @param arr2 Array 2.
 * @returns
 */
function findFirstDiffIndex<T>(
  arr1: ReadonlyArray<T>,
  arr2: ReadonlyArray<T>
): number {
  for (let i = 0; i < arr1.length; i++) {
    if (i === arr2.length) {
      return i;
    }

    if (arr1[i] !== arr2[i]) {
      return i;
    }
  }

  return arr1.length === arr2.length ? -1 : arr1.length;
}

export type PlaceNameEditorProps = {
  onSubmit: (data: PlaceNameData) => Promise<boolean>;
  onCancel: () => void;
};

export function PlaceNameEditor({
  onSubmit,
  onCancel,
}: PlaceNameEditorProps): React.JSX.Element {
  const [spelling, setSpelling] = useState<string>("");
  const [reading, setReading] = useState<string>("");
  const [moras, setMoras] = useState<Mora[]>([]);
  const [pitches, setPitches] = useState<MoraPitch[]>([]);
  const [readingError, setReadingError] = useState<string>("");
  const [_relativeEntries, setRelativeEntries] = useState<RelativeEntry[]>([]);

  // Flag to track whether the user is currently composing text.
  const isComposingRef = useRef<boolean>(false);

  const isValidEntry = spelling && reading && moras.length > 0 && !readingError;

  const handleSpellingChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSpelling = e.target.value.trim();
      setSpelling(newSpelling);
    },
    []
  );

  const handleReadingChange = useCallback(
    (newReading: string) => {
      try {
        if (!newReading) {
          throw "";
        }

        if (isComposingRef.current) {
          return;
        }

        if (!moraSchema.safeParse(newReading).success) {
          throw "ひらがなのみで入力してください";
        }

        // Replace moras and pitches.
        // Pitch for unchanged moras are retained, and the rest are set to the
        // same pitch as the last unchanged mora.
        const newMoras = splitByMora(newReading);
        const firstDiffIndex = findFirstDiffIndex(newMoras, moras);
        if (firstDiffIndex === -1) {
          return;
        }

        setMoras(newMoras);

        setPitches((prev) => {
          const retainedPitches = prev.slice(0, firstDiffIndex);
          const lastMoraPitch = prev[firstDiffIndex - 1] || DEFAULT_MORA_PITCH;
          const succeedingPicthes = newMoras
            .slice(firstDiffIndex)
            .map(() => lastMoraPitch);
          return [...retainedPitches, ...succeedingPicthes];
        });

        // TODO: Find relative entries and set new ones.
        setRelativeEntries([]);
      } catch (err: unknown) {
        if (typeof err === "string") {
          setReadingError(err as string);
        } else {
          setReadingError("不正な入力です");
        }

        setMoras([]);
        setPitches([]);
        setRelativeEntries([]);
      } finally {
        setReading(newReading);
      }
    },
    [moras]
  );

  const handlePitchChange = useCallback((index: number, pitch: MoraPitch) => {
    setPitches((prev) => {
      const newPitches = [...prev];
      newPitches[index] = pitch;
      return newPitches;
    });
  }, []);

  async function handleSubmit() {
    if (!isValidEntry) {
      return;
    }

    const newData = createPlaceNameData(spelling, moras, pitches);
    if ((await onSubmit(newData)) === false) {
      return;
    }

    setSpelling("");
    setReading("");
    setMoras([]);
    setPitches([]);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-foreground">
          地名の発音を登録
        </h2>
        <p className="text-sm text-muted-foreground">
          地名の綴りと読み、アクセントを設定してください
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Spelling */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="spelling">地名の綴り</Label>
          <Input
            id="spelling"
            placeholder="例: 大手町"
            value={spelling}
            onChange={handleSpellingChange}
          />
        </div>

        {/* Reading */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="reading">
            読み
            <span className="text-muted-foreground text-xs">
              （ひらがなのみ）
            </span>
          </Label>
          <Input
            id="reading"
            placeholder="例: おーてまち"
            value={reading}
            onChange={(e) => handleReadingChange(e.target.value)}
            onCompositionStart={() => {
              isComposingRef.current = true;
            }}
            onCompositionEnd={() => {
              isComposingRef.current = false;
              handleReadingChange(reading);
            }}
            aria-invalid={!!readingError}
          />
          {readingError && (
            <p className="text-destructive text-xs">{readingError}</p>
          )}
        </div>

        {/* Accent Editor */}
        <div className="flex flex-col gap-2">
          <Label>アクセント</Label>
          <div className="p-3 rounded-lg bg-secondary/50 border">
            <AccentEditor
              moras={moras}
              pitches={pitches}
              onPitchChange={handlePitchChange}
            />
          </div>
        </div>

        {/* TODO: Implement relative entry notification */}
        {/* Existing entry notification */}
        {/* {relativeEntries.length > 0 && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <InfoIcon className="size-4 text-primary mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-primary">類似の登録があります</p>
                <p className="text-muted-foreground">
                  {existingEntry.spelling}（{existingEntry.reading}）
                </p>
              </div>
            </div>
          )} */}
      </div>

      {/* Footer 相当 */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          キャンセル
        </Button>
        <Button onClick={handleSubmit} disabled={!isValidEntry}>
          登録
        </Button>
      </div>
    </div>
  );
}
