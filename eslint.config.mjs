import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";
import prettier from "eslint-config-prettier";

// Frameworks and IO libraries that must never appear in a domain layer.
const DOMAIN_FORBIDDEN_EXTERNALS = [
  "next",
  "next/*",
  "react",
  "react-dom",
  "react/*",
  "react-dom/*",
  "drizzle-orm",
  "drizzle-orm/*",
  "@supabase/*",
  "ai",
  "@ai-sdk/*",
  "postgres",
];

const eslintConfig = [
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "coverage/**"],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
      "import/resolver": {
        typescript: { alwaysTryTypes: true },
      },
      "boundaries/elements": [
        { type: "app", pattern: "src/app/**" },
        {
          type: "feature-presentation",
          pattern: "src/features/*/presentation/**",
          capture: ["feature"],
        },
        {
          type: "feature-application",
          pattern: "src/features/*/application/**",
          capture: ["feature"],
        },
        {
          type: "feature-domain",
          pattern: "src/features/*/domain/**",
          capture: ["feature"],
        },
        {
          type: "feature-infrastructure",
          pattern: "src/features/*/infrastructure/**",
          capture: ["feature"],
        },
        { type: "shared-domain", pattern: "src/shared/domain/**" },
        { type: "shared-ui", pattern: "src/shared/ui/**" },
        { type: "shared-infrastructure", pattern: "src/shared/infrastructure/**" },
        { type: "shared-lib", pattern: "src/shared/lib/**" },
        { type: "styles", pattern: "src/styles/**" },
      ],
    },
    rules: {
      // presentation → application → domain ← infrastructure; inner never imports outer.
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          policies: [
            {
              // src/app is the composition root: it wires everything together.
              from: { element: { type: "app" } },
              allow: {
                to: {
                  element: {
                    types: {
                      anyOf: [
                        "app",
                        "feature-presentation",
                        "feature-application",
                        "feature-domain",
                        "feature-infrastructure",
                        "shared-domain",
                        "shared-ui",
                        "shared-infrastructure",
                        "shared-lib",
                        "styles",
                      ],
                    },
                  },
                },
              },
            },
            {
              from: { element: { type: "feature-presentation" } },
              allow: {
                to: {
                  element: {
                    types: {
                      anyOf: [
                        "feature-presentation",
                        "feature-application",
                        "feature-domain",
                      ],
                    },
                    captured: { feature: "{{ from.element.captured.feature }}" },
                  },
                },
              },
            },
            {
              from: { element: { type: "feature-presentation" } },
              allow: {
                to: {
                  element: {
                    types: { anyOf: ["shared-domain", "shared-ui", "shared-lib"] },
                  },
                },
              },
            },
            {
              from: { element: { type: "feature-application" } },
              allow: {
                to: {
                  element: {
                    types: { anyOf: ["feature-application", "feature-domain"] },
                    captured: { feature: "{{ from.element.captured.feature }}" },
                  },
                },
              },
            },
            {
              from: { element: { type: "feature-application" } },
              allow: {
                to: { element: { types: { anyOf: ["shared-domain", "shared-lib"] } } },
              },
            },
            {
              from: { element: { type: "feature-infrastructure" } },
              allow: {
                to: {
                  element: {
                    types: { anyOf: ["feature-infrastructure", "feature-domain"] },
                    captured: { feature: "{{ from.element.captured.feature }}" },
                  },
                },
              },
            },
            {
              from: { element: { type: "feature-infrastructure" } },
              allow: {
                to: {
                  element: {
                    types: {
                      anyOf: ["shared-domain", "shared-infrastructure", "shared-lib"],
                    },
                  },
                },
              },
            },
            {
              from: { element: { type: "feature-domain" } },
              allow: {
                to: {
                  element: {
                    type: "feature-domain",
                    captured: { feature: "{{ from.element.captured.feature }}" },
                  },
                },
              },
            },
            {
              from: { element: { type: "feature-domain" } },
              allow: { to: { element: { type: "shared-domain" } } },
            },
            {
              from: { element: { type: "shared-ui" } },
              allow: {
                to: {
                  element: {
                    types: { anyOf: ["shared-ui", "shared-domain", "shared-lib"] },
                  },
                },
              },
            },
            {
              from: { element: { type: "shared-infrastructure" } },
              allow: {
                to: {
                  element: {
                    types: {
                      anyOf: ["shared-infrastructure", "shared-domain", "shared-lib"],
                    },
                  },
                },
              },
            },
            {
              from: { element: { type: "shared-domain" } },
              allow: { to: { element: { type: "shared-domain" } } },
            },
            {
              from: { element: { type: "shared-lib" } },
              allow: {
                to: { element: { types: { anyOf: ["shared-lib", "shared-domain"] } } },
              },
            },
          ],
        },
      ],
    },
  },
  {
    // Domain layers are pure TS: no framework/IO imports at all.
    files: ["src/features/*/domain/**/*.{ts,tsx}", "src/shared/domain/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: DOMAIN_FORBIDDEN_EXTERNALS,
              message:
                "Domain must stay pure TypeScript — no framework/IO imports. Put this in infrastructure.",
            },
          ],
        },
      ],
    },
  },
  prettier,
];

export default eslintConfig;
