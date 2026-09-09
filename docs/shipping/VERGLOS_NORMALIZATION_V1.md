# Verglos Severity and Confidence Normalization v1

Normalization preserves each producer's original severity/confidence alongside
the normalized value and mapping version. Known aliases map deterministically;
unknown future/vendor values remain `unknown` and uncertain rather than being
silently downgraded or upgraded. Confidence mapping is independent from
severity policy and never authenticates an imported assertion.
