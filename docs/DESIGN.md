# Resona — Design Language

Status: draft v0.1 — foundation set; theme tokens lock once a mockup is chosen.
Visual language owner: **Jimmy Ong**. Engineering integration: Aisling Leiva.

## Origin & translation
The design language grows from Jimmy's concept image — nature + ocean, a leaf-and-
soundwave mark, and a three-step "Voice → Text → Refresh" story. That image is
illustrative concept art (text over a photographic scene); production UI does **not**
copy it literally. We keep the palette, the mark, and the story, and express them as
clean, legible, accessible, Apple-HIG-compliant screens on solid surfaces.

## Brand foundation
- Name: **Resona** (unchanged). Privacy-first positioning (unchanged).
- Feeling: natural, calm, clear, trustworthy.
- Mark: a **leaf containing a soundwave** — nature (calm, yours) + voice. Replaces the
  earlier gold "resonance-rings" mark, which is now superseded.
- Story motif: Voice → Text → Refresh (capture, transcribe, polish).

## Color palette — LOCKED (Deep Current)
Direction chosen: **Deep Current** (dark-first). Dark is the signature expression; a
light parity theme ships for Light Mode / accessibility. Never encode meaning by color
alone — pair every color with text, icon, or shape.

Dark theme (default brand):
- App bg `#04171C` · screen `#082530` · surface `#0E323E` · surface-alt `#0B2B36` · hairline `#1C4350`
- Text primary `#EAF6F1` · text muted `#9FB8B5`
- Accent: mint `#5FD3A0` (primary action) · mint-bright `#7FE6B6` (emphasis) · teal `#57C6D6` · leaf `#3FB37E`
- On-mint text/icons: `#062018` · sand highlight `#E3C57F` (sparing)

Light theme (parity):
- Bg `#EAF1EC` · surface `#FFFFFF` · surface-alt `#F4F8F4` · hairline `#E0E8E1`
- Text primary `#10211B` · text muted `#5C6B63`
- Accent: leaf `#1B6E45` (primary) · leaf-deep `#0F4D2F` · teal `#0E7C86` · sand `#C9A24B`

Contrast verified to WCAG AA (body >= 4.5:1, large/UI >= 3:1) in both themes.

## Typography
- System font: SF Pro / `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI",
  Roboto, system-ui, sans-serif`. (The earlier Georgia serif is dropped.)
- Support **Dynamic Type** — layouts must reflow as text scales; no fixed-height text boxes.
- Two weights in UI: regular (400) and semibold (600) for emphasis/titles.

## Iconography & motion
- SF Symbols style: simple, consistent stroke, outline.
- Motion is subtle and meaningful (waveform, transitions). Respect **Reduce Motion** —
  freeze/dampen animations when the OS setting is on.

## Accessibility requirements (WCAG 2.1 AA — non-negotiable)
- Contrast: body text ≥ 4.5:1; large text and UI components/icons ≥ 3:1. Verify every
  text-on-fill pairing; the concept image's text-on-photo fails this and is not shipped.
- Tap targets ≥ 44×44 pt with adequate spacing.
- Visible focus states for every interactive element.
- VoiceOver labels on all controls; decorative visuals marked aria-hidden.
- Text scales with Dynamic Type; never trap content in fixed sizes.
- Honor Reduce Motion and Increase Contrast.
- Live dictation needs a non-color status cue (label + icon, not just the green dot).

## Apple Human Interface Guidelines checklist
- Clarity, deference, depth — content first, chrome quiet.
- Respect safe areas (Dynamic Island / notch / home indicator).
- Use standard patterns: large titles, tab bar, sheets; don't reinvent navigation.
- Support Light and Dark mode with semantic colors.
- App icon: full-bleed, no transparency, provide all required sizes; the leaf+wave mark
  must read at 1024px down to a 40px favicon.
- Haptics for record start/stop and key confirmations.
- Standard gestures unmodified.

## Status
- [x] Direction chosen: **Deep Current** (mockup-2).
- [x] Tokens locked (above).
- [x] Logo set produced in `/brand`: wordmark (dark + light), app mark, favicon, hero — gold assets replaced.
- [x] Landing hero rebuilt; PRD §2 updated; PRD docx regenerated with the new cover.
- [ ] Build light-theme parity in-app; confirm AA in both modes on device.
- [ ] Accessibility + Apple HIG audit before beta (see TODO.md).
