const TABBABLE = [
  "a[href]",
  "button",
  "input",
  "select",
  "textarea",
  "[tabindex]",
].join(",");

function isVisible(element: HTMLElement): boolean {
  if (element.hasAttribute("hidden")) return false;
  const style = element.ownerDocument.defaultView?.getComputedStyle(element);
  return style?.visibility !== "hidden" && style?.display !== "none";
}

function isTabbable(element: HTMLElement): boolean {
  if (element.hasAttribute("disabled")) return false;
  if (element.tabIndex < 0) return false;
  return isVisible(element);
}

/**
 * Moves focus to the first tabbable element outside `field`, in either
 * direction. Returns false when there is nothing to move to, so the caller
 * can leave the event alone.
 *
 * The time picker gives only one of its sections a tabIndex of 0 — the hours.
 * Typing a time always ends on the minutes, whose tabIndex is -1, and focus
 * parked outside the tab order leaves Firefox with no starting point: the
 * next Tab restarts from the top of the document and walks the header again.
 *
 * Rather than fight the picker's roving tabIndex, the field takes Tab over.
 * That is also what the ARIA practices ask for: inside a composite widget the
 * arrow keys move between the parts and Tab leaves the widget. Here that means
 * Tab goes from Início to Jornada whether the caret sat on the hours or the
 * minutes.
 */
export function focusAdjacent(field: HTMLElement, direction: 1 | -1): boolean {
  const outside = [
    ...field.ownerDocument.querySelectorAll<HTMLElement>(TABBABLE),
  ].filter((element) => !field.contains(element) && isTabbable(element));

  const follows = (element: HTMLElement) =>
    (field.compareDocumentPosition(element) &
      Node.DOCUMENT_POSITION_FOLLOWING) !==
    0;

  const before = outside.filter((element) => !follows(element));
  const after = outside.filter(follows);

  const next = direction === 1 ? after[0] : before[before.length - 1];
  if (next === undefined) return false;

  next.focus();
  return true;
}
