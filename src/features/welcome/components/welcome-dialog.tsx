// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2026 Rerrah

import type React from "react";
import ExampleDisplayImage from "@/assets/example_display.png";
import ExampleEditImage from "@/assets/example_edit.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWelcomeStore } from "@/stores/welcome";

export function WelcomeDialog(): React.JSX.Element {
  const { isWelcomeDialogOpen, changeOpenWelcomeDialogState } =
    useWelcomeStore();

  return (
    <Dialog
      open={isWelcomeDialogOpen}
      onOpenChange={changeOpenWelcomeDialogState}
    >
      <DialogContent className="z-[2000] max-h-[80dvh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl">
            🗾 全国地名地元の発音マップ
          </DialogTitle>
          <DialogDescription className="sr-only" />
        </DialogHeader>

        <div className="space-y-6 py-4">
          <section className="space-y-2">
            <p className="text-base leading-relaxed">
              日本各地の地名の<strong>地元での</strong>
              「読み方」と「アクセント」を地図上で自由に登録・閲覧できるWebマップです。本当の地名の発音を知りましょう・知ってもらいましょう。
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">
              地名の読みとアクセントを確認する
            </h2>
            <p className="text-sm leading-relaxed">
              地図上のマーカーを左クリック（またはタップ）すると、その地点の地名の表記・読み・アクセントを確認できます。
            </p>
            <p className="text-sm leading-relaxed">
              気に入った投稿には「いいね」を押せます。
            </p>
            <img src={ExampleDisplayImage} alt="地点情報の表示例" />
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">
              新しい地点の読みとアクセントを登録する
            </h2>
            <p className="text-sm leading-relaxed">
              地図上を左クリック（または長押し）して「この地点の地名と読みを登録」を選ぶと、地名の表記・読み・アクセントを入力できます。
            </p>

            <div
              className="rounded-lg p-3"
              style={{ backgroundColor: "var(--tips-bg)" }}
            >
              <p
                className="mb-2 text-sm font-semibold"
                style={{ color: "var(--tips-text-heading)" }}
              >
                Tips: 読みは実際の発音に合わせて入力するのがおすすめです。
              </p>
              <div
                className="space-y-1 text-sm"
                style={{ color: "var(--tips-text-content)" }}
              >
                <p>例:</p>
                <p className="ml-4">「おおおかやま」→「おーおかやま」</p>
                <p className="ml-4">「とうえい」→「とーえー」</p>
              </div>
            </div>

            <img src={ExampleEditImage} alt="地点情報の編集例" />
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">
              地点の報告・削除の依頼をする
            </h2>
            <p className="text-sm leading-relaxed">
              地点の読みの表示画面にある「報告」アイコンから、削除依頼や問題報告を送れます。
            </p>
          </section>

          <section className="space-y-3 border-t pt-4">
            <p className="text-sm text-appendix">
              要望・不具合報告は
              <a
                href="https://github.com/rerrahkr/place-name-accent-map"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GitHub
              </a>
              からお願いします。
            </p>
          </section>
        </div>
      </DialogContent>
      <DialogOverlay className="z-[1500]" />
    </Dialog>
  );
}
