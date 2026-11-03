<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Hostinger deploy: `npm run build:hostinger` (scripts/build-hostinger.mjs) builds with NITRO_PRESET=node-server into `hostinger-upload/` and pre-downloads Lovable-hosted `.asset.json` images, failing if any download fails — why: Hostinger runs plain Node and must not receive an incomplete media bundle.
- Logo images retry against the published Lovable origin when their local asset request fails — why: existing standalone deployments may lack the bundled logo file.
