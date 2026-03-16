import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { LostPet } from '../lost-pets/entities/lost-pet.entity';
import { FoundPet } from '../found-pets/entities/found-pet.entity';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor(private readonly configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.get<string>('MAIL_USER'),
                pass: this.configService.get<string>('MAIL_PASS'),
            },
        });
    }

    async sendMatchNotification(
        lostPet: LostPet,
        foundPet: FoundPet,
    ): Promise<void> {
        const mapboxToken = this.configService.get<string>('MAPBOX_TOKEN', '');
        const mailFrom = this.configService.get<string>('MAIL_FROM', 'petradar@noreply.com');

        // Extract coordinates from GeoJSON points
        const lostCoords = this.extractCoordinates(lostPet.location);
        const foundCoords = this.extractCoordinates(foundPet.location);

        // Build Mapbox Static Map URL with both pins
        const mapUrl = this.buildMapUrl(lostCoords, foundCoords, mapboxToken);

        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
          .content { padding: 30px; }
          .section { margin-bottom: 24px; }
          .section h2 { color: #333; font-size: 18px; margin-bottom: 12px; border-bottom: 2px solid #667eea; padding-bottom: 6px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
          .info-item { padding: 8px 12px; background: #f8f9fa; border-radius: 6px; }
          .info-item .label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
          .info-item .value { font-size: 14px; color: #333; font-weight: 500; margin-top: 2px; }
          .description-box { background: #f8f9fa; padding: 12px; border-radius: 6px; border-left: 4px solid #667eea; margin-top: 8px; }
          .map-container { text-align: center; margin: 20px 0; }
          .map-container img { width: 100%; max-width: 560px; border-radius: 8px; border: 1px solid #e0e0e0; }
          .map-legend { display: flex; justify-content: center; gap: 20px; margin-top: 8px; font-size: 13px; }
          .legend-item { display: flex; align-items: center; gap: 4px; }
          .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
          .dot-red { background: #ff0000; }
          .dot-green { background: #00cc00; }
          .contact-box { background: #e8f5e9; padding: 16px; border-radius: 8px; }
          .contact-box h3 { margin: 0 0 10px; color: #2e7d32; font-size: 16px; }
          .contact-info { font-size: 14px; color: #333; line-height: 1.8; }
          .footer { text-align: center; padding: 20px; color: #aaa; font-size: 12px; background: #f8f9fa; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🐾 PetRadar — Posible avistamiento</h1>
            <p>¡Alguien encontró una mascota que podría ser <strong>${lostPet.name}</strong>!</p>
          </div>

          <div class="content">
            <div class="section">
              <h2>🔍 Mascota Encontrada</h2>
              <div class="info-grid">
                <div class="info-item">
                  <div class="label">Especie</div>
                  <div class="value">${foundPet.species}</div>
                </div>
                <div class="info-item">
                  <div class="label">Raza</div>
                  <div class="value">${foundPet.breed || 'No identificada'}</div>
                </div>
                <div class="info-item">
                  <div class="label">Color</div>
                  <div class="value">${foundPet.color}</div>
                </div>
                <div class="info-item">
                  <div class="label">Tamaño</div>
                  <div class="value">${foundPet.size}</div>
                </div>
              </div>
              <div class="description-box">
                <strong>Descripción:</strong> ${foundPet.description}
              </div>
            </div>

            <div class="section">
              <h2>📍 Ubicación</h2>
              <p style="font-size: 14px; color: #555;">Encontrada en: <strong>${foundPet.address}</strong></p>
              <div class="map-container">
                <img src="${mapUrl}" alt="Mapa con ubicaciones" />
                <div class="map-legend">
                  <span class="legend-item"><span class="dot dot-red"></span> Donde se perdió</span>
                  <span class="legend-item"><span class="dot dot-green"></span> Donde se encontró</span>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="contact-box">
                <h3>📞 Contacto de quien la encontró</h3>
                <div class="contact-info">
                  <strong>Nombre:</strong> ${foundPet.finder_name}<br>
                  <strong>Email:</strong> ${foundPet.finder_email}<br>
                  <strong>Teléfono:</strong> ${foundPet.finder_phone}
                </div>
              </div>
            </div>
          </div>

          <div class="footer">
            PetRadar — Ayudando a reunir mascotas con sus familias 🐾
          </div>
        </div>
      </body>
      </html>
    `;

        await this.transporter.sendMail({
            from: mailFrom,
            to: lostPet.owner_email,
            subject: `🐾 ¡Posible avistamiento de tu mascota ${lostPet.name}!`,
            html: htmlContent,
        });
    }

    private extractCoordinates(
        location: any,
    ): { lng: number; lat: number } {
        // PostGIS returns GeoJSON: { type: 'Point', coordinates: [lng, lat] }
        if (location && location.coordinates) {
            return {
                lng: location.coordinates[0],
                lat: location.coordinates[1],
            };
        }
        return { lng: 0, lat: 0 };
    }

    private buildMapUrl(
        lostCoords: { lng: number; lat: number },
        foundCoords: { lng: number; lat: number },
        token: string,
    ): string {
        const lostPin = `pin-l-heart+ff0000(${lostCoords.lng},${lostCoords.lat})`;
        const foundPin = `pin-l-star+00cc00(${foundCoords.lng},${foundCoords.lat})`;

        return (
            `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/` +
            `${lostPin},${foundPin}/auto/600x400@2x?access_token=${token}`
        );
    }
}
