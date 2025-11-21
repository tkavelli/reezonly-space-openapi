#!/usr/bin/env node

const SwaggerParser = require('@apidevtools/swagger-parser');
const yaml = require('js-yaml');
const fs = require('fs-extra');
const path = require('path');

async function buildOpenAPI() {
  try {
    console.log('🚀 Building Reezonly Space Platform API specification...');

    // Load base specification
    const baseSpec = await SwaggerParser.validate(path.resolve(__dirname, '../specs/core/base.yaml'));

    console.log('✅ Base specification loaded');

    // Create complete specification
    const completeSpec = {
      ...baseSpec,
      tags: [],
      paths: {},
      components: {
        ...baseSpec.components,
        schemas: {
          ...baseSpec.components?.schemas
        },
        parameters: {
          ...baseSpec.components?.parameters
        },
        responses: {
          ...baseSpec.components?.responses
        }
      }
    };

    // Load and merge modules
    const modules = [
      'users',
      'groups',
      'certificates',
      'learning',
      'reports'
    ];

    console.log(`📚 Loading ${modules.length} modules...`);

    // collect tags uniquely by name
    const tagMap = new Map();

    for (const moduleName of modules) {
      console.log(`  📄 Loading ${moduleName} module...`);
      const moduleSpec = await SwaggerParser.validate(path.resolve(__dirname, `../specs/${moduleName}.yaml`));

      // Merge tags
      if (moduleSpec.tags) {
        moduleSpec.tags.forEach(tag => {
          if (!tagMap.has(tag.name)) {
            tagMap.set(tag.name, tag);
          }
        });
      }

      // Merge paths
      Object.assign(completeSpec.paths, moduleSpec.paths);

      // Merge components
      if (moduleSpec.components) {
        if (moduleSpec.components.schemas) {
          completeSpec.components.schemas = {
            ...completeSpec.components.schemas,
            ...moduleSpec.components.schemas
          };
        }
        if (moduleSpec.components.parameters) {
          completeSpec.components.parameters = {
            ...completeSpec.components.parameters,
            ...moduleSpec.components.parameters
          };
        }
        if (moduleSpec.components.responses) {
          completeSpec.components.responses = {
            ...completeSpec.components.responses,
            ...moduleSpec.components.responses
          };
        }
      }
    }

    // Load common components
    console.log('🔧 Loading common components...');

    const commonSchemas = yaml.load(fs.readFileSync(path.resolve(__dirname, '../specs/core/common/schemas.yaml'), 'utf8'));
    const commonParameters = yaml.load(fs.readFileSync(path.resolve(__dirname, '../specs/core/common/parameters.yaml'), 'utf8'));
    const commonResponses = yaml.load(fs.readFileSync(path.resolve(__dirname, '../specs/core/common/responses.yaml'), 'utf8'));

    // Merge common components
    if (commonSchemas.components?.schemas) {
      completeSpec.components.schemas = {
        ...completeSpec.components.schemas,
        ...commonSchemas.components.schemas
      };
    }

    if (commonParameters.components?.parameters) {
      completeSpec.components.parameters = {
        ...completeSpec.components.parameters,
        ...commonParameters.components.parameters
      };
    }

    if (commonResponses.components?.responses) {
      completeSpec.components.responses = {
        ...completeSpec.components.responses,
        ...commonResponses.components.responses
      };
    }

    // Normalize $ref to internal components (avoid file-relative refs after merge)
    const normalizeRef = (ref) => {
      if (typeof ref !== 'string') return ref;
      return ref
        .replace(/\.?\.?\/core\/common\/schemas\.yaml#\/components\/schemas\//g, '#/components/schemas/')
        .replace(/\.?\.?\/core\/common\/parameters\.yaml#\/components\/parameters\//g, '#/components/parameters/')
        .replace(/\.?\.?\/core\/common\/responses\.yaml#\/components\/responses\//g, '#/components/responses/')
        .replace(/\.?\.?\/common\/schemas\.yaml#\/components\/schemas\//g, '#/components/schemas/')
        .replace(/\.?\.?\/common\/parameters\.yaml#\/components\/parameters\//g, '#/components/parameters/')
        .replace(/\.?\.?\/common\/responses\.yaml#\/components\/responses\//g, '#/components/responses/')
        .replace(/\.?\.?\/schemas\.yaml#\/components\/schemas\//g, '#/components/schemas/')
        .replace(/\.?\.?\/parameters\.yaml#\/components\/parameters\//g, '#/components/parameters/')
        .replace(/\.?\.?\/responses\.yaml#\/components\/responses\//g, '#/components/responses/');
    };

    const walk = (obj) => {
      if (Array.isArray(obj)) return obj.forEach(walk);
      if (obj && typeof obj === 'object') {
        Object.entries(obj).forEach(([k, v]) => {
          if (k === '$ref' && typeof v === 'string') {
            obj[k] = normalizeRef(v);
          } else {
            walk(v);
          }
        });
      }
    };
    walk(completeSpec);

    // Deduplicate tags after processing
    completeSpec.tags = Array.from(tagMap.values());

    // Normalize path prefixes: drop leading /v1 for consistency with public spec
    const normalizedPaths = {};
    Object.entries(completeSpec.paths).forEach(([p, val]) => {
      const np = p.startsWith('/v1/') ? p.slice(3) : p;
      normalizedPaths[np] = val;
    });
    completeSpec.paths = normalizedPaths;

    // Keep only the public 45 endpoints
    const allowed = new Map([
      ['/user/user/index', ['get']],
      ['/user/user/admin', ['get']],
      ['/user/user/view', ['get']],
      ['/dictionary/user/fields', ['get']],
      ['/user/user/create', ['post']],
      ['/user/user/update', ['put']],
      ['/user/user/delete', ['delete']],
      ['/dictionary/user/statuses', ['get']],
      ['/user/user/add-course', ['post']],
      ['/user/user/delete-course', ['post']],
      ['/user/user/preview', ['post']],
      ['/user/user/load', ['post']],
      ['/user/user/get-import-progress', ['get']],
      ['/user/user/load-template', ['get']],
      ['/user/import-report/index', ['get']],
      ['/user/importreport/download', ['get']],
      ['/group/group/index', ['get','post']],
      ['/group/group/view', ['get']],
      ['/group/group/create', ['post']],
      ['/group/group/update', ['put']],
      ['/group/group/delete', ['delete']],
      ['/dictionary/user/groups', ['get']],
      ['/group/group/user-add', ['post']],
      ['/group/group/user-delete', ['post']],
      ['/group/group/assign-courses', ['post']],
      ['/group/group/multiple-delete', ['delete']],
      ['/group/group/export', ['post']],
      ['/group/group/export-download', ['get']],
      ['/certificate/template/index', ['get']],
      ['/certificate/template/view', ['get']],
      ['/certificate/certificate/create', ['post']],
      ['/certificate/certificate/index', ['get']],
      ['/certificate/certificate/view', ['get']],
      ['/certificate/certificate/download', ['get']],
      ['/certificate/download-zip', ['post']],
      ['/certificate/course/index', ['get']],
      ['/certificate/user/index', ['get']],
      ['/certificate/type/index', ['get']],
      ['/certificate/variable/index', ['get']],
      ['/certificate/variable-list/index', ['get']],
      ['/dictionary/dictionary/page-types', ['get']],
      ['/dictionary/dictionary/pages', ['get']],
      ['/course/course/index', ['get']],
      ['/course/course/view', ['get']],
      ['/integration/report/consolidated', ['post']],
    ]);

    for (const path of Object.keys(completeSpec.paths)) {
      if (!allowed.has(path)) {
        delete completeSpec.paths[path];
        continue;
      }
      const allowedMethods = new Set(allowed.get(path));
      for (const method of Object.keys(completeSpec.paths[path])) {
        if (!allowedMethods.has(method)) {
          delete completeSpec.paths[path][method];
        }
      }
      if (!Object.keys(completeSpec.paths[path]).length) {
        delete completeSpec.paths[path];
      }
    }

    // Create tagGroups for better organization
    completeSpec['x-tagGroups'] = [
      {
        name: "Users",
        title: "User Management — 16 методов",
        description: "Раздел User Management предназначен для синхронизации пользователей между вашей CRM/ERP и платформой Space. Каждый пользователь имеет профиль с контактной информацией, роль доступа, статус и может быть участником групп и курсов.\n\nUser представляет пользователя в системе Reezonly Space. Каждый пользователь имеет профиль с контактной информацией, роль доступа, статус и может быть участником групп и курсов.",
        tags: ["Users.Operations", "Users.Courses", "Users.Import", "Users.Fields"]
      },
      {
        name: "Groups",
        title: "Groups — 12 методов",
        description: "Раздел Groups предназначен для управления иерархической структурой групп пользователей в системе Space. Группы могут иметь вложенность, что позволяет создавать сложные организационные структуры.\n\nGroup представляет собой коллекцию пользователей с общей ролью или принадлежностью к отделу/проекту. Группы поддерживают иерархическую структуру с неограниченной вложенностью.",
        tags: ["Groups.Structure", "Groups.Members"]
      },
      {
        name: "Certificates",
        title: "Certificates — 12 методов",
        description: "Раздел Certificates предназначен для управления PDF сертификатами, которые выдаются пользователям за прохождение курсов. Система поддерживает шаблоны сертификатов, массовую и индивидуальную выдачу, а также интеграцию с внешними системами верификации.\n\nCertificate представляет собой PDF документ, подтверждающий успешное завершение обучения. Каждый сертификат имеет уникальный номер, дату выдачи и может быть проверен через публичный интерфейс.",
        tags: ["Certificates.Templates", "Certificates.Issued", "Certificates.Lookups"]
      },
      {
        name: "Learning",
        title: "Learning — 4 метода (READ-ONLY)",
        description: "Раздел Learning предоставляет доступ к каталогу курсов и страниц контента в режиме чтения. Основной контент курсов хранится во внешней LMS системе, а Space выступает как витрина и система управления доступом.\n\n⚠️ Важно: Эти методы доступны только для чтения. Изменение контента курсов и уроков выполняется через LMS, а не через этот API.",
        tags: ["Courses", "Pages"]
      },
      {
        name: "Integration Reports",
        title: "Integration Reports — 1 метод",
        description: "Раздел Integration Reports предназначен для предоставления аналитических данных внешним системам. Этот модуль позволяет получать отчеты об интеграционной активности, результатах импорта и экспорта данных, а также ключевые метрики для мониторинга работы интеграций.",
        tags: ["Integration Reports"]
      }
    ];

    // Validate final specification (only dereference for now)
    console.log('🔍 Processing final specification...');
    await SwaggerParser.dereference(completeSpec);

    // Save complete specification as the single source of truth
    const outputPath = path.resolve(__dirname, '../space-platform-api.yaml');
    const yamlContent = yaml.dump(completeSpec, {
      indent: 2,
      lineWidth: -1,
      noRefs: true
    });

    await fs.writeFile(outputPath, yamlContent, 'utf8');

    console.log(`\n✅ Build completed successfully!`);
    console.log(`📄 Output: ${outputPath}`);
    console.log(`📊 Statistics:`);
    console.log(`  - Methods: ${Object.keys(completeSpec.paths).length}`);
    console.log(`  - Tags: ${completeSpec.tags.length}`);
    console.log(`  - TagGroups: ${completeSpec['x-tagGroups'].length}`);
    console.log(`  - Schemas: ${Object.keys(completeSpec.components.schemas).length}`);

    // Method count by category
    const methodCounts = {};
    Object.entries(completeSpec.paths).forEach(([path, pathItem]) => {
      Object.keys(pathItem).forEach(method => {
        const tags = pathItem[method].tags || ['Unknown'];
        tags.forEach(tag => {
          methodCounts[tag] = (methodCounts[tag] || 0) + 1;
        });
      });
    });

    console.log(`\n📋 Methods by category:`);
    Object.entries(methodCounts).forEach(([tag, count]) => {
      console.log(`  - ${tag}: ${count}`);
    });

  } catch (error) {
    console.error('❌ Build failed:', error.message);
    if (error.details) {
      console.error('Details:', error.details);
    }
    process.exit(1);
  }
}

// Run build
buildOpenAPI();
