---
title: "TrueNAS Scale — Onderzoek naar een Open Source HomeLab"
description: "Een onderzoeksopdracht waarin ik TrueNAS Scale verken als basis voor een homelab: ZFS, hardware-keuzes, alternatieven en mijn eigen labopstelling met gerecupereerde componenten."
pubDate: 2023-03-22
category: "Opleidingsproject"
tags:
  - TrueNAS Scale
  - ZFS
  - Home Lab
  - Linux
  - Docker
  - Virtualization
  - Storage
---

## Wat is dit project?

Voor het vak IT Essentials kreeg ik de kans om een onderzoeksopdracht te doen rond een onderwerp naar keuze. Aangezien ik op dat moment al een tijd geinteresseerd was door het idee van een eigen home server — voor opslag, het zelf hosten van services, en gewoonweg om bij te leren, koos ik voor **TrueNAS Scale** als onderwerp. Het resultaat is een paper waarin ik dieper inga op het systeem, de hardware-overwegingen, het ZFS-bestandssysteem en een concrete labopstelling.

## Link naar het verslag

<a href="/documents/truenas.pdf" target="_blank">open het verslag (PDF) →</a>

## Waarom TrueNAS Scale?

TrueNAS Scale is een gratis en open source software-defined storage solution gebaseerd op FreeNAS. In tegenstelling tot zijn voorganger TrueNAS Core (die op FreeBSD draait), is Scale gebouwd op Debian Linux. Dat opent de deur naar een veel breder ecosysteem: KVM-virtualisatie en Docker-ondersteuning zitten standaard mee in het pakket.

Tijdens mijn onderzoek vergeleek ik het met de meest populaire alternatieven:

- **Unraid** — flexibel met mix-and-match schijven en een actieve community, maar niet open source en vereist een licentie
- **QNAP & Synology** — kant-en-klare toestellen met een polished interface, maar je zit vast aan het meegeleverde besturingssysteem en betaalt aanzienlijk meer
- **Proxmox** — uitstekend als hypervisor first, maar minder geschikt als je de focus op storage legt

Voor mijn use case won TrueNAS Scale op alle vlakken: ZFS als bestandssysteem, op Debian gebaseerd, ingebouwde virtualisatie, eindeloze configuratiemogelijkheden, weinig hardware-beperkingen, en volledig gratis.

## ZFS: het hart van TrueNAS

ZFS is wat TrueNAS écht onderscheidt van de meeste alternatieven. In de paper duik ik dieper in vier kernconcepten:

### Storage pools en RAIDZ

ZFS organiseert schijven in **pools** met verschillende redundantie-niveaus. RAIDZ1 verdraagt het uitvallen van één schijf, RAIDZ2 van twee, en RAIDZ3 van drie. Hogere pariteit betekent meer bescherming, maar minder netto opslagcapaciteit.

### Datasets

Een **dataset** is een logische container binnen een pool. Vergelijkbaar met een map in een traditioneel bestandssysteem, maar met krachtige extra mogelijkheden zoals compressie, quota, snapshots en aparte share-instellingen per dataset.

### Read & write cache (ARC, L2ARC, ZIL)

ZFS gebruikt RAM intensief als **ARC** (Adaptive Replacement Cache) — recent gelezen "hot data" wordt in het werkgeheugen bewaard voor razendsnelle herhaalde toegang. Wanneer de ARC vol is, kan een snelle SSD ingezet worden als **L2ARC** (Level 2 ARC) voor een tweede cache-laag.

Voor schrijfoperaties bestaat de **ZIL** (ZFS Intent Log), die schrijfoperaties bundelt voor betere prestaties en gegevensintegriteit garandeert bij een onverwachte stroomonderbreking.

### Snapshots

Mijn favoriete feature: ZFS snapshots zijn vrijwel instant en bijna gratis qua opslag. Omdat ZFS bij een wijziging de oude data niet overschrijft maar nieuwe blokken aanmaakt, is een snapshot eigenlijk gewoon een lijst pointers naar bestaande blokken. Pas wanneer je de laatste snapshot verwijdert die naar een datablok verwijst, wordt de ruimte daadwerkelijk vrijgegeven. Herstellen naar een eerder moment gaat in seconden.

## Hardware-overwegingen

Een home server bouwen hoeft geen fortuin te kosten gerecupereerde componenten van oude desktops doen vaak prima dienst. Wel zijn er een aantal specifieke overwegingen:

- **Moederbord** — let op CPU-socket, aantal RAM-slots, ECC-ondersteuning, SATA-poorten en netwerk
- **CPU** — moet zeker virtualisatie ondersteunen (Intel VT-x of AMD-V); meer cores = meer VM's
- **RAM** — ECC is een plus voor data-integriteit, maar niet strikt noodzakelijk; meer RAM = grotere ARC = betere prestaties
- **Opslag** — combinatie van HDD's voor capaciteit en SSD's voor cache (L2ARC/ZIL)
- **PSU** — kies een efficiënte en eventueel modulaire voeding
- **Behuizing** — afhankelijk van locatie: stille tower in de woonkamer, of een 19" rackmount in een bergruimte

Bij continu draaiende systemen is idle stroomverbruik een belangrijk aandachtspunt. 

## Mijn labopstelling

Voor de demo bouwde ik een server uit een combinatie van gerecupereerde en nieuwe componenten:

- **Moederbord:** ASUS ROG Maximus VII Ranger
- **CPU:** Intel i7-4790K
- **RAM:** 24GB DDR3 (2×8GB + 2×4GB)
- **OS-schijf:** Samsung 870 EVO 250GB
- **Data-pool:** 3× Seagate 8TB HDD
- **L2ARC:** Samsung 980 PRO 1TB NVMe
- **SLOG (ZIL):** Samsung 980 PRO 250GB NVMe
- **Behuizing:** Inter-Tech 19" 2U rackmount
- **Rack:** Caymon OPR512A 12U

![NASv1](../images/nasv1.jpg)

![Rackv1](../images/rackv1.jpg)
Niet de meest energie-efficiënte combinatie wat te zien is op de wattmeter. Daarom voorzag ik out-of-band toegang via een Raspberry Pi zero 2W met PIKVM: zo kan ik de server vanop afstand aan- en uitzetten, en alleen laten draaien wanneer effectief nodig.


### Application stack

```
TrueNAS Scale (host OS)
  └── Debian 11 VM
        └── Docker
              └── App containers
```

In plaats van apps rechtstreeks op TrueNAS te draaien, host ik ze in een Debian VM met Docker. Dat geeft me volledige controle over de container-omgeving.

### Netwerktopologie

De server zit achter een pfSense firewall met tailscale, waardoor ik vanop afstand veilig bij mijn data kan zonder poorten open te zetten.

## Wat ik geleerd heb

Dit was mijn eerste echte deep-dive in storage en virtualisatie. Voor het project had ik wel een basiskennis, maar de subtielere zaken zoals ZFS, het Copy on Write principe, het verschil tussen ARC, L2ARC en ZIL, heb ik tijdens dit onderzoek leren begrijpen.

Deze opstelling vormde achteraf de basis van mijn homelab. Ondertussen is dat verder geëvolueerd. De server en NAS heb ik later opgesplitst in twee aparte machines voor betere SMART-monitoring, en de hardware werd geüpgraded. Maar dit project was waar het allemaal begon.

## Demo

[Video van de presentatie op YouTube →](https://youtu.be/9zGQq5W9NqM)