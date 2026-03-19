import nextConfig from 'eslint-config-next/core-web-vitals'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'

const eslintConfig = [
  ...nextConfig,
  eslintPluginUnicorn.configs.recommended,
  {
    rules: {
      'unicorn/filename-case': ['error', { cases: { kebabCase: true } }],
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-query-selector': 'off'
    }
  }
]

export default eslintConfig
