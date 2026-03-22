---
title: "Security Operations Center Lab"
description: "Opbouw van een volledig functioneel SOC-lab met Wazuh, TheHive, MISP en geautomatiseerde incident response workflows via n8n."
pubDate: 2025-06-15
category: "Opleidingsproject"
tags:
  - Wazuh
  - TheHive
  - MISP
  - Suricata
  - n8n
  - pfSense
  - Docker
  - OpenVAS
---

## Wat is dit project?

Voor mijn bachelorproef heb ik een volledig functioneel Security Operations Center (SOC) lab gebouwd. Het doel was om te laten zien hoe een organisatie met open-source tooling een professionele security monitoring en incident response pipeline kan opzetten — van detectie tot geautomatiseerde afhandeling.

Het volledige lab draait in Docker op een Debian mini-PC met een Intel i5 11e generatie processor en 64GB RAM.

## Waarom een SOC lab?

Veel organisaties worstelen met security monitoring. Ze hebben wel firewalls en antivirus, maar missen het overzicht: wat gebeurt er op het netwerk? Welke alerts zijn kritiek? En hoe reageer je snel en consistent op incidenten?

Een SOC biedt dat overzicht. Door een lab te bouwen dat alle componenten van een echte SOC bevat, heb ik niet alleen geleerd hoe elke tool werkt, maar ook hoe ze samenwerken in een geïntegreerde pipeline.

## Architectuur

Het lab bestaat uit de volgende componenten:

### Detectie & Monitoring

- **Wazuh** als SIEM — verzamelt en correleert security events van alle aangesloten systemen, genereert alerts op basis van rules en decoders
- **Suricata** als IDS — analyseert netwerkverkeer op verdachte patronen, geïntegreerd via pfSense
- **pfSense** als firewall — netwerkbeveiliging en traffic routing, met Suricata als inline IDS
- **OpenVAS** voor vulnerability scanning — periodieke scans om kwetsbaarheden in het netwerk te identificeren

### Incident Response

- **TheHive** voor case management — elke alert wordt een case met taken, observables en een volledige audit trail
- **MISP** voor threat intelligence — IOC's (Indicators of Compromise) worden centraal beheerd en gebruikt voor verrijking van alerts

### Automatisering

- **n8n** als SOAR platform — automatiseert de volledige workflow van alert tot case, inclusief IOC-verrijking via MISP

## De SOAR Workflow

Het hart van het lab is de geautomatiseerde alert-to-case pipeline in n8n. Wanneer Wazuh een alert genereert, gebeurt het volgende:

1. **Alert ontvangst** — n8n ontvangt de Wazuh alert via webhook
2. **IOC extractie** — relevante indicators (IP-adressen, hashes, domeinen) worden uit de alert gehaald
3. **MISP verrijking** — elke IOC wordt opgezocht in MISP om te controleren of het een bekende threat is
4. **Case aanmaak** — in TheHive wordt automatisch een case aangemaakt met alle context: de originele alert, de geëxtraheerde IOC's en de MISP verrijkingsresultaten
5. **Taak toewijzing** — standaard taken worden aan de case toegevoegd zodat een analyst direct weet wat er moet gebeuren

Deze workflow is door meerdere iteraties gegaan. De eerste versies hadden problemen met IOC-verwerking en MISP detectie, die stap voor stap zijn opgelost tot een betrouwbare pipeline.

## Technische uitdagingen

Het project kende een aantal significante uitdagingen:

**IOC-verwerking** — het correct extraheren en normaliseren van indicators uit verschillende alert-formaten vergde veel iteratie. Niet elke Wazuh alert bevat dezelfde velden, dus de n8n workflow moest robuust genoeg zijn om met variatie om te gaan.

**MISP integratie** — de koppeling tussen n8n en MISP was complex. MISP heeft een uitgebreide API, maar het correct opzoeken van IOC's en het verwerken van de resultaten in een bruikbaar formaat voor TheHive vergde meerdere workflow-versies.

**Docker networking** — alle componenten draaien in Docker containers die met elkaar moeten communiceren. Het correct configureren van netwerken, volumes en dependencies was een puzzel op zich.

**Resource management** — een volledig SOC-lab is hongerig. Wazuh, TheHive, MISP, Suricata, pfSense, OpenVAS en n8n tegelijk draaien op één machine vereist zorgvuldig resource management. De 64GB RAM was geen luxe.

## Wat heb ik geleerd?

Dit project heeft mij een diepgaand begrip gegeven van hoe security operations in de praktijk werken. Niet alleen de individuele tools — die leer je snel kennen — maar vooral hoe je ze integreert tot een samenwerkend geheel.

De belangrijkste les: automatisering is essentieel in security operations. Een SOC die volledig draait op manuele analyse schaalt niet. Door de alert-to-case pipeline te automatiseren, kan een analyst zich focussen op wat echt telt: het beoordelen en afhandelen van incidenten, in plaats van het handmatig kopiëren van data tussen systemen.

Daarnaast heb ik geleerd dat een goed lab bouwen een iteratief proces is. De eerste versie van de n8n workflow werkte, maar was fragiel. Pas na meerdere iteraties en het testen met realistische scenario's werd het een betrouwbaar systeem.