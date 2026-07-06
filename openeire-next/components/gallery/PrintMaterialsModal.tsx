"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import {
  printMaterialFulfilmentNote,
  printMaterials,
} from "@/lib/gallery/printMaterials";

interface PrintMaterialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  id?: string;
}

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function PrintMaterialsModal({
  isOpen,
  onClose,
  id = "print-materials-modal",
}: PrintMaterialsModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const scrollY = window.scrollY;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.width = originalBodyWidth;
      window.scrollTo({ top: scrollY, behavior: "auto" });
      previouslyFocusedElementRef.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => !element.hasAttribute("disabled"));

      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !isMounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-stretch justify-center overflow-x-hidden p-3 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
    >
      <button
        type="button"
        className="fixed inset-0 cursor-default bg-black/85 backdrop-blur-sm"
        aria-label="Close print materials information"
        onClick={onClose}
      />

<div
      ref={dialogRef}
      id={id}
      className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-gray-950 shadow-2xl sm:max-h-[90dvh]"
    >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-gray-900 p-5 sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">
              Print Materials
            </p>
            <h2
              id={`${id}-title`}
              className="mt-2 font-serif text-2xl font-bold text-white sm:text-3xl"
            >
              About our print materials
            </h2>
            <p
              id={`${id}-description`}
              className="mt-2 max-w-3xl text-sm leading-6 text-gray-300"
            >
              A quick guide to the feel, finish and display style of each
              OpenEire print material.
            </p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-white/10 bg-black/40 p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Close print materials information"
          >
            <FaTimes aria-hidden="true" />
          </button>
        </div>

        <div className="custom-scrollbar overflow-y-auto overscroll-contain p-5 sm:p-6">
          <div className="rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm font-medium leading-6 text-gray-100">
            {printMaterialFulfilmentNote}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {printMaterials.map((material) => (
              <section
                key={material.name}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
              >
                <h3 className="font-serif text-xl font-bold text-white">
                  {material.name}
                </h3>
                <dl className="mt-4 space-y-3 text-sm leading-6">
                  <MaterialDetail label="Feel / texture">
                    {material.feelTexture}
                  </MaterialDetail>
                  <MaterialDetail label="Finish">
                    {material.finish}
                  </MaterialDetail>
                  <MaterialDetail label="Printing">
                    {material.printingMethod}
                  </MaterialDetail>
                  <MaterialDetail label="Colour & contrast">
                    {material.colourContrast}
                  </MaterialDetail>
                  <MaterialDetail label="Framing / display">
                    {material.framingDisplay}
                  </MaterialDetail>
                  <MaterialDetail label="Shipping">
                    {material.shippingFormat}
                  </MaterialDetail>
                  <MaterialDetail label="Best suited for">
                    {material.bestSuitedFor}
                  </MaterialDetail>
                </dl>
              </section>
            ))}
          </div>

          <div className="mt-8 overflow-hidden rounded-xl border border-white/10">
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full border-collapse text-left text-sm">
                <caption className="sr-only">
                  Print material comparison table
                </caption>
                <thead className="bg-brand-900/40 text-xs uppercase tracking-widest text-accent">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Material
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Finish
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Texture
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Colour & Contrast
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Best For
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Ships As
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-black/30 text-gray-300">
                  {printMaterials.map((material) => (
                    <tr key={material.name}>
                      <th
                        scope="row"
                        className="px-4 py-4 align-top font-semibold text-white"
                      >
                        {material.name}
                      </th>
                      <td className="px-4 py-4 align-top">
                        {material.finish}
                      </td>
                      <td className="px-4 py-4 align-top">
                        {material.feelTexture}
                      </td>
                      <td className="px-4 py-4 align-top">
                        {material.colourContrast}
                      </td>
                      <td className="px-4 py-4 align-top">
                        {material.bestSuitedFor}
                      </td>
                      <td className="px-4 py-4 align-top">
                        {material.shippingFormat}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function MaterialDetail({
  children,
  label,
}: {
  children: string;
  label: string;
}) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-widest text-gray-500">
        {label}
      </dt>
      <dd className="mt-1 text-gray-300">{children}</dd>
    </div>
  );
}
