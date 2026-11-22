# Security

Skills are instructions that agents run against live systems. A skill that sends data somewhere it should not, hides an endpoint, injects instructions, or removes an approval gate is a security problem.

## Report a problem

Use GitHub's private vulnerability reporting: open the **Security** tab of this repository and choose **Report a vulnerability**. Please include the skill name, the file, and what it does.

Please do not open a public issue for a live problem. We will remove or fix a confirmed bad skill first and discuss it afterwards.

## What we check on every submission

- No data sent to an endpoint the reader does not own.
- No hardcoded secrets, and no request for a user's credentials.
- No prompt-injection patterns.
- Every bulk, destructive, money or outbound-message step has a human approval.
