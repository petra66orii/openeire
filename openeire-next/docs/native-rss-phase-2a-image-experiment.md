# Phase 2A: Next.js image optimisation experiment

## Purpose

This is a controlled production experiment to determine whether Next.js image
optimisation, including its Sharp/libvips native allocations, is responsible
for persistent RSS growth that is not represented by the V8 heap, external
memory, or array buffer metrics.

The experiment changes one variable only. It does not establish Sharp/libvips
as the cause unless the resulting fresh-process memory profile differs
materially from the normal optimised configuration.

## Experiment flag

Set the following production environment variable for the experiment:

```text
NEXT_IMAGE_OPTIMIZATION_DISABLED=1
```

An exact value of `1` sets `images.unoptimized` to `true`. An absent variable,
`0`, or any other value preserves normal Next.js image optimisation.

At startup the server emits a boolean-only diagnostic:

```text
[server-image-optimization] { nextImageOptimizationDisabled: true }
```

The diagnostic does not include the environment value or any secrets.

## Production procedure

1. Record the current deployment, configuration, and pre-experiment memory
   profile as the control.
2. Configure `NEXT_IMAGE_OPTIMIZATION_DISABLED=1` for the experimental
   deployment.
3. Deploy and restart from a fresh process. Do not reuse the high-RSS process
   as the experiment baseline.
4. Confirm the startup diagnostic reports
   `nextImageOptimizationDisabled: true`.
5. Record startup `rssMiB`, `heapUsedMiB`, `heapTotalMiB`, `externalMiB`, and
   `arrayBuffersMiB` before deliberately warming routes.
6. Exercise a consistent route set, including:
   - the home page and other canonical public pages;
   - the blog listing and representative blog details;
   - the physical gallery listing;
   - representative physical gallery detail pages with remote images.
7. Confirm images remain visually correct. With optimisation disabled, image
   URLs and payload sizes may differ, so also check responsive layout and page
   loading behaviour.
8. Observe Render RSS and the server memory diagnostics for 48–72 hours under
   ordinary traffic. Record step changes and the associated route activity.
9. Compare the experiment with the control using:
   - startup and warmed RSS;
   - maximum and steady-state RSS;
   - `heapUsedMiB` and `heapTotalMiB`;
   - `externalMiB`;
   - `arrayBuffersMiB`;
   - restart count and traffic level.
10. Remove the flag or set it to `0` after the observation window unless the
    result justifies a separate product decision about image delivery.

Do not change allocator settings during this experiment. `MALLOC_ARENA_MAX`
may be evaluated later as a separate Render environment experiment, after the
image result is understood, so that allocator and image-processing effects are
not conflated.
