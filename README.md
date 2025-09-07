# Documentation Integration Guide

This guide explains how other BioMedGPS component repositories can integrate with this documentation hub.

## 🔧 Quick Integration

Add this step to your component repository's GitHub Actions workflow after building documentation:

```yaml
- name: Trigger BioMedGPS documentation update
  if: success() && github.ref == 'refs/heads/main'
  run: |
    curl -X POST \
      -H "Authorization: token ${{ secrets.GITHUB_TOKEN }}" \
      -H "Accept: application/vnd.github.v3+json" \
      -H "Content-Type: application/json" \
      https://api.github.com/repos/${{ github.repository_owner }}/biomedgps-docs/dispatches \
      -d '{
        "event_type": "docs-submitted",
        "client_payload": {
          "repository": "${{ github.event.repository.name }}",
          "docs_url": "https://github.com/${{ github.repository }}/releases/download/latest/docs.tar.gz",
          "sha": "${{ github.sha }}",
          "commit_message": "${{ github.event.head_commit.message }}",
          "github_org": "${{ github.repository_owner }}",
          "branch": "main",
          "docs_path": "docs/"
        }
      }'
```

## 📦 Documentation Packaging Methods

### Method 1: Release Archive (Recommended)
Create a release with documentation archive:

```yaml
- name: Package documentation
  run: |
    cd docs/
    tar -czf ../docs.tar.gz .
    
- name: Create Release with Docs
  uses: softprops/action-gh-release@v1
  with:
    tag_name: "docs-${{ github.sha }}"
    files: docs.tar.gz
```

### Method 2: Direct Repository Access
The hub can clone your repository and extract docs:

```yaml
# In your trigger call, use:
"client_payload": {
  "repository": "your-component-name",
  "github_org": "your-org-name",
  "branch": "main",
  "docs_path": "docs/"
}
```

## 🏗️ Component Documentation Structure

Ensure your documentation follows this structure:

```
your-component/
├── docs/
│   ├── index.html          # Main entry point (required)
│   ├── assets/            # CSS, JS, images
│   ├── api/               # API documentation
│   ├── examples/          # Usage examples
│   └── guides/            # User guides
└── .github/
    └── workflows/
        └── docs.yml       # Build and trigger workflow
```

## 🔑 Required Payload Fields

| Field            | Required | Description                                                                                                           |
| ---------------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| `repository`     | ✅        | Must match: `network-medicine-extension`, `biomedgps-data`, `biomedgps-models`, `biomedgps-explainer`, or `biomedgps` |
| `docs_url`       | ⚠️        | URL to download docs archive (if using Method 1)                                                                      |
| `github_org`     | ⚠️        | GitHub organization/user (if using Method 2)                                                                          |
| `sha`            | ✅        | Commit SHA for tracking                                                                                               |
| `commit_message` | ⭕        | Optional commit message                                                                                               |
| `branch`         | ⭕        | Source branch (defaults to 'main')                                                                                    |
| `docs_path`      | ⭕        | Path to docs in repo (defaults to 'docs/')                                                                            |

## 📋 Complete Example Workflow

Here's a complete GitHub Actions workflow for a component repository:

```yaml
name: Build and Deploy Documentation

on:
  push:
    branches: [ main ]
    paths:
      - 'docs/**'
      - 'src/**'
      - '*.md'

jobs:
  build-docs:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build documentation
        run: |
          npm run build:docs
          # Ensure index.html exists
          if [ ! -f "docs/index.html" ]; then
            echo "Error: docs/index.html not found"
            exit 1
          fi

      - name: Package documentation
        run: |
          cd docs/
          tar -czf ../docs.tar.gz .
          cd ..

      - name: Create documentation release
        id: create_release
        uses: softprops/action-gh-release@v1
        with:
          tag_name: "docs-${{ github.sha }}"
          name: "Documentation Build ${{ github.sha }}"
          files: docs.tar.gz
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Trigger BioMedGPS documentation hub update
        if: success()
        run: |
          curl -X POST \
            -H "Authorization: token ${{ secrets.GITHUB_TOKEN }}" \
            -H "Accept: application/vnd.github.v3+json" \
            -H "Content-Type: application/json" \
            https://api.github.com/repos/${{ github.repository_owner }}/biomedgps-docs/dispatches \
            -d '{
              "event_type": "docs-submitted",
              "client_payload": {
                "repository": "${{ github.event.repository.name }}",
                "docs_url": "${{ steps.create_release.outputs.upload_url }}/docs.tar.gz",
                "sha": "${{ github.sha }}",
                "commit_message": "${{ github.event.head_commit.message }}",
                "github_org": "${{ github.repository_owner }}",
                "branch": "${{ github.ref_name }}",
                "docs_path": "docs/"
              }
            }'

      - name: Cleanup
        run: rm -f docs.tar.gz
```

## ✅ Validation Checklist

Before integrating, ensure:

- [ ] Your repository name matches one of the valid component names
- [ ] Documentation builds successfully to `docs/` directory  
- [ ] `docs/index.html` exists and loads properly
- [ ] GitHub Actions workflow has proper permissions
- [ ] Webhook payload includes required fields
- [ ] Documentation follows responsive design principles
- [ ] All assets use relative paths

## 🚨 Troubleshooting

### Common Issues

1. **Invalid repository name**: Must be exactly one of the five component names
2. **Missing index.html**: Each component must have a main entry point
3. **Broken assets**: Use relative paths, not absolute URLs
4. **Webhook failures**: Check token permissions and payload format
5. **Archive extraction errors**: Ensure tar.gz format and proper structure

### Debug Information

Check the Actions logs in the `biomedgps-docs` repository for detailed error messages. The workflow validates:

- Repository name against allowed list
- Documentation structure
- File downloads and extraction
- Git operations

## 📞 Support

If you encounter issues:

1. Check the GitHub Actions logs in both repositories
2. Verify your payload matches the expected format
3. Test documentation builds locally
4. Create an issue in the `biomedgps-docs` repository

## 🔄 Update Process

The documentation hub will:

1. Receive your webhook trigger
2. Validate the repository name and payload
3. Download and extract your documentation
4. Commit changes to the appropriate directory
5. Trigger a rebuild and deployment
6. Notify of success/failure

Expected processing time: 2-5 minutes depending on documentation size.