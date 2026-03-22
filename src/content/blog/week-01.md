---
title: "Network Automation met Ansible & Semaphore"
description: "Ontwerp en implementatie van een Ansible-gebaseerd automation platform voor het beheer van Cisco netwerkinfrastructuur op een lokale productie-site."
pubDate: 2026-03-22
category: "Stage"
tags:
  - Ansible
  - Semaphore
  - Cisco IOS
  - GitLab
  - Docker
  - Linux
---

## Wat is dit project?

Tijdens mijn stage van 16 weken heb ik een Ansible-gebaseerd network automation platform ontworpen en geïmplementeerd voor het beheer van Cisco netwerkinfrastructuur op een lokale productie-site. Het platform wordt aangestuurd via Semaphore als orchestratie-interface en maakt gebruik van GitLab voor versiebeheer van playbooks, configuratie-backups en inventory rapporten.

## Waarom network automation?

Het handmatig beheren van netwerkinfrastructuur is tijdrovend, foutgevoelig en niet schaalbaar. Eén typfout in een configuratie kan een heel netwerksegment platleggen. Door configuratiebeheer te automatiseren met Ansible worden wijzigingen herhaalbaar, gedocumenteerd en veilig uitgevoerd — elke keer op dezelfde manier.

## Opbouwende aanpak: Read → Backup → Write

Het project volgt een bewust opbouwende aanpak in drie niveaus. Elke fase bouwt voort op het vertrouwen dat de vorige fase heeft opgeleverd.

### Read Operations

De eerste stap was bewijzen dat Ansible betrouwbaar met alle devices kan communiceren. Een read playbook leest device informatie uit zoals hostname, serial number, IOS version en platform. De output wordt gegenereerd in twee formaten:

- **CSV** — voor export naar Excel op de corporate SharePoint
- **Markdown** — voor een leesbaar overzicht rechtstreeks in GitLab

Deze rapporten worden automatisch geüpload naar een dedicated reporting repository in GitLab.

### Backup Automation

Met de zekerheid dat Ansible betrouwbaar communiceert, werd de volgende stap het veiligstellen van configuraties. Een backup playbook haalt de running-config en startup-config op van elk device en slaat deze op in een Git repository. Zo is er een volledige versiegeschiedenis beschikbaar van elke configuratiewijziging.

De backups draaien automatisch via scheduling in Semaphore en vormen een cruciaal vangnet voor de volgende fase.

### Write Operations

Dit is de meest impactvolle fase — en de kern van het project. De focus ligt niet zozeer op de playbooks zelf, maar op het **safe deployment framework** dat elke write operatie omsluit.

Het framework werkt in vier stappen:

1. **Pre-change backup** — automatische backup van de huidige running-config
2. **Dry-run** — uitvoering in Ansible check mode om te valideren wat er zou veranderen
3. **Uitvoering** — de configuratiewijziging doorvoeren, met automatische rollback bij falen
4. **Post-change validatie** — vergelijking van de configuratie voor en na de wijziging

Dit framework is getest met opzettelijke foutscenario's in het lab, waaronder ongeldige configuraties en connectiviteitsverlies mid-change.

De write playbooks die via dit framework zijn uitgerold:

- **Banner deployment** — de eerste en veiligste write operatie, gebruikt om het framework end-to-end te valideren
- **SNMPv3 configuratie** — consistente monitoring-configuratie over alle devices, inclusief opruimen van legacy SNMPv2 communities
- **VLAN consistentie** — een gewenste VLAN-database als source of truth, het playbook rolt ontbrekende VLANs aan en signaleert afwijkingen

## Uitrolstrategie

Elke playbook doorloopt een gefaseerde uitrol om risico's te minimaliseren:

1. **Lab** — ontwikkeling en testing op het fysieke Cisco lab, met out-of-band console access als vangnet
2. **Light production** — validatie op een beperkt aantal niet-kritieke productie toestellen op de lokale site
3. **Volledige lokale site** — uitrol naar alle devices na succesvolle validatie

## Infrastructuur

De volledige automation stack draait op een development server die vooraf is gehard met een CIS Level 1 Debian hardening playbook. Semaphore draait in Docker op deze server, met test en productie strikt gescheiden via aparte projecten en inventories. GitLab draait op een aparte productie-server.

Alle credentials worden versleuteld opgeslagen in de Semaphore key store — er staan geen plaintext wachtwoorden in code of inventory files. Het lab is voorzien van out-of-band console access: elk device is via console kabel aangesloten op de development server, zodat bij problemen elk toestel altijd bereikbaar blijft.

## Wat heb ik geleerd?

Dit project heeft mij geleerd dat de waarde van automation niet zit in het schrijven van playbooks — dat is relatief rechttoe rechtaan. De echte uitdaging en toegevoegde waarde zit in het ontwerpen van een veilig en robuust deployment proces. Een framework dat je kunt vertrouwen, dat fouten opvangt, en dat herbruikbaar is voor elke toekomstige operatie.