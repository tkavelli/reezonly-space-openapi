#!/usr/bin/env node

const yaml = require('js-yaml');
const fs = require('fs-extra');
const path = require('path');

async function simpleBuild() {
  try {
    console.log('🚀 Simple building Reezonly Space Platform API specification...');

    // Load base specification
    const baseSpec = yaml.load(fs.readFileSync(path.resolve(__dirname, '../specs/core/base.yaml'), 'utf8'));
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

    for (const moduleName of modules) {
      console.log(`  📄 Loading ${moduleName} module...`);
      const moduleSpec = yaml.load(fs.readFileSync(path.resolve(__dirname, `../specs/${moduleName}.yaml`), 'utf8'));

      // Merge tags
      if (moduleSpec.tags) {
        completeSpec.tags.push(...moduleSpec.tags);
      }

      // Merge paths
      Object.assign(completeSpec.paths, moduleSpec.paths || {});

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

    // Fix $ref references to internal
    console.log('🔧 Fixing $ref references...');
    const yamlString = yaml.dump(completeSpec, {
      indent: 2,
      lineWidth: -1,
      noRefs: false
    });

    // Replace relative refs with internal refs
    const convertRelativeRef = (path) => {
      const componentMatch = path.match(/schemas\.yaml#\/components\/(.+)/);
      const parameterMatch = path.match(/parameters\.yaml#\/components\/(.+)/);
      const responseMatch = path.match(/responses\.yaml#\/components\/(.+)/);

      const simpleName = (value) => value.split('/').pop();

      if (componentMatch) {
        return `$ref: '#/components/schemas/${simpleName(componentMatch[1])}'`;
      } else if (parameterMatch) {
        return `$ref: '#/components/parameters/${simpleName(parameterMatch[1])}'`;
      } else if (responseMatch) {
        return `$ref: '#/components/responses/${simpleName(responseMatch[1])}'`;
      }

      return `$ref: '#/components/${path}'`;
    };

    const fixedYamlString = yamlString
      .replace(/\$ref:\s*(?:['"])?(?:\.\/|(?:\.\.\/)+)core\/common\/([^'\"\s]+)(?:['"])?/g, (match, path) =>
        convertRelativeRef(path)
      )
      .replace(/\$ref:\s*(?:['"])?(?:\.\/|(?:\.\.\/)+)common\/([^'\"\s]+)(?:['"])?/g, (match, path) =>
        convertRelativeRef(path)
      );

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
        description: "Раздел Learning предоставляет read-only доступ к каталогу курсов, продуктов и маркетинговых страниц. Метаданные каждого курса включают `id`, `alias`, `type`, `status`, количество студентов, картинку, связанное LMS-событие и таймстэмпы публикации. Отдельно раскрываются страницы (`Landing`, `Product`, `Article`, `FAQ`) с их URI, SEO-описаниями, `enabled`-флагом и привязками к продуктовым сущностям. Используйте эти методы, чтобы построить витрину, отрисовать контентные блоки и синхронизировать структуру без возможности редактировать исходные материалы (все записи заводятся только через LMS/контент-редактор).",
        tags: ["Courses", "Pages"]
      },
      {
        name: "Integration Reports",
        title: "Integration Reports — 1 метод",
        description: "Раздел Integration Reports предназначен для предоставления аналитических данных внешним системам. Этот модуль позволяет получать отчеты об интеграционной активности, результатах импорта и экспорта данных, а также ключевые метрики для мониторинга работы интеграций.",
        tags: ["Integration Reports"]
      }
    ];

    // Save complete specification
    const outputPath = path.resolve(__dirname, '../bundles/complete-api.yaml');
    await fs.writeFile(outputPath, fixedYamlString, 'utf8');

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
        if (method !== 'parameters') {
          const tags = pathItem[method].tags || ['Unknown'];
          tags.forEach(tag => {
            methodCounts[tag] = (methodCounts[tag] || 0) + 1;
          });
        }
      });
    });

    console.log(`\n📋 Methods by category:`);
    Object.entries(methodCounts).forEach(([tag, count]) => {
      console.log(`  - ${tag}: ${count}`);
    });

    console.log(`\n🎉 Total methods: ${Object.values(methodCounts).reduce((a, b) => a + b, 0)}`);

  } catch (error) {
    console.error('❌ Build failed:', error.message);
    if (error.details) {
      console.error('Details:', error.details);
    }
    process.exit(1);
  }
}

// Run build
simpleBuild();
