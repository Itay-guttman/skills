# Profiles

Your profile on https://automationskills.ai/contributors/ comes from two files here, both named with your profile slug: the last part of your profile URL. For `https://automationskills.ai/contributor/simon-gelfand/` the slug is `simon-gelfand`.

- `profiles/<slug>.json`: your name, title, company, bio and links.
- `profiles/<slug>.jpg` (or `.png`, `.webp`): your headshot. Square, at least 400 x 400 pixels, under 2 MB, your face only.

Every field is optional. Anything you leave out keeps what the site shows today.

```json
{
  "name": "Your Name",
  "title": "Head of Automation",
  "company": "Your Company",
  "bio": "One or two sentences about the automations you build and run.",
  "links": {
    "linkedin": "https://www.linkedin.com/in/your-handle/",
    "x": "https://x.com/your-handle",
    "github": "https://github.com/your-handle",
    "website": "https://example.com",
    "youtube": "https://www.youtube.com/@your-handle"
  }
}
```

Limits: name, title and company up to 80 characters, bio up to 400. Links must start with `https://`. Plain text only, no HTML.

## How to change it

The easiest way is the **Edit your profile** box at the bottom of your profile page on the site. Its buttons open GitHub with the file ready to edit. GitHub copies the repo to your account and opens a pull request for you; no git needed.

- **Text:** press **Edit profile text**, change the JSON, and press **Propose changes**.
- **Photo:** press **Upload photo**, drop in a file named `<slug>.jpg`, and press **Propose changes**.
- **No GitHub account:** email your photo and changes to hello@automationskills.ai from an address we can match to you.

A maintainer checks that the pull request comes from the person on the profile: the GitHub account must match `links.github` or be linked from your LinkedIn, X or site. Then the change shows on the site within the hour.
