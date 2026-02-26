/**
 * Modal for assigning influencers to campaigns
 */

import { useState, useEffect } from 'react';
import { Dialog, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getUsers } from '@/lib/api/auth';
import { assignInfluencer } from '@/lib/api/campaign-influencers';
import type { User } from '@/types';

interface AssignInfluencerModalProps {
  open: boolean;
  onClose: () => void;
  campaignId: string;
  onSuccess: () => void;
}

export function AssignInfluencerModal({
  open,
  onClose,
  campaignId,
  onSuccess,
}: AssignInfluencerModalProps) {
  const [influencers, setInfluencers] = useState<User[]>([]);
  const [selectedInfluencerId, setSelectedInfluencerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (open) {
      loadInfluencers();
    }
  }, [open]);

  const loadInfluencers = async () => {
    try {
      const users = await getUsers('influencer');
      setInfluencers(users);
    } catch (err: any) {
      setError(err.message || 'Failed to load influencers');
    }
  };

  const handleAssign = async () => {
    if (!selectedInfluencerId) {
      setError('Please select an influencer');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await assignInfluencer({
        campaignId,
        influencerId: selectedInfluencerId,
      });
      onSuccess();
      onClose();
      setSelectedInfluencerId('');
      setSearchTerm('');
    } catch (err: any) {
      setError(err.message || 'Failed to assign influencer');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedInfluencerId('');
    setSearchTerm('');
    setError(null);
    onClose();
  };

  const filteredInfluencers = influencers.filter(
    (inf) =>
      inf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inf.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={handleClose} title="Assign Influencer">
      <div className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div>
          <Label htmlFor="search">Search Influencers</Label>
          <Input
            id="search"
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Select Influencer</Label>
          <div className="mt-2 max-h-64 space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-2">
            {filteredInfluencers.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-500">
                No influencers found
              </p>
            ) : (
              filteredInfluencers.map((inf) => (
                <label
                  key={inf.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                    selectedInfluencerId === inf.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="influencer"
                    value={inf.id}
                    checked={selectedInfluencerId === inf.id}
                    onChange={(e) => setSelectedInfluencerId(e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{inf.name}</p>
                    <p className="text-sm text-gray-500">{inf.email}</p>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="ghost" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleAssign} disabled={loading || !selectedInfluencerId}>
          {loading ? 'Assigning...' : 'Assign'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
