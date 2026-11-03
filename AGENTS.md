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

- Hostinger deploy: `npm run build:hostinger` (scripts/build-hostinger.mjs) builds with NITRO_PRESET=node-server into `hostinger-upload/` and pre-downloads Lovable-hosted `.asset.json` images into it — why: Hostinger runs plain Node and has no `/__l5e` asset host.
