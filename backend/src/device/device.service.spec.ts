import { DeviceService } from "./device.service"
import { Test, TestingModule } from '@nestjs/testing';

describe('NewDeviceService', () => {
    let service: DeviceService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [DeviceService],
        }).compile();
    
        service = module.get<DeviceService>(DeviceService);
      });
    
      it('should be defined', () => {
        expect(service).toBeDefined();
      });
});
