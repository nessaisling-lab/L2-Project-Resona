//! Local transcript export. Privacy-first: everything is written to a folder on
//! the user's own machine (Documents/Resona); nothing leaves the device.
//! Content building is kept pure so it can be unit-tested without a running app.

/// Plain-text export: just the transcript, newline-terminated.
pub fn build_txt(text: &str) -> String {
    format!("{}\n", text.trim())
}

/// Markdown export: a titled document, optionally with the local grammar score.
pub fn build_markdown(text: &str, score: Option<u32>, recommendation: Option<&str>) -> String {
    let mut out = String::from("# Resona transcript\n\n");
    out.push_str(text.trim());
    out.push('\n');
    if let Some(s) = score {
        out.push_str(&format!("\n---\n\n**Writing score:** {s}/100"));
        if let Some(rec) = recommendation {
            if !rec.is_empty() {
                out.push_str(&format!(" — {rec}"));
            }
        }
        out.push('\n');
    }
    out
}

/// Pick the file extension for a requested format. Anything unknown falls back
/// to txt (the always-available free-tier format).
pub fn extension_for(format: &str) -> &'static str {
    match format {
        "md" => "md",
        _ => "txt",
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn txt_is_trimmed_and_newline_terminated() {
        assert_eq!(build_txt("  hello world  "), "hello world\n");
    }

    #[test]
    fn markdown_has_title_and_body() {
        let md = build_markdown("Hello there.", None, None);
        assert!(md.starts_with("# Resona transcript\n\n"));
        assert!(md.contains("Hello there."));
        assert!(!md.contains("Writing score")); // omitted when no score
    }

    #[test]
    fn markdown_includes_score_when_present() {
        let md = build_markdown("Body.", Some(87), Some("Reads well — ship it as is."));
        assert!(md.contains("**Writing score:** 87/100 — Reads well"));
    }

    #[test]
    fn unknown_format_falls_back_to_txt() {
        assert_eq!(extension_for("md"), "md");
        assert_eq!(extension_for("txt"), "txt");
        assert_eq!(extension_for("pdf"), "txt");
    }
}
